'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FullLesson, UserProgress, User } from '@/types'
import confetti from 'canvas-confetti'
import TierTransition from '@/components/animations/TierTransition'
import FadeIn from '@/components/animations/FadeIn'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'
import QuestionCard from '@/components/ui/QuestionCard'
import AnimatedButton from '@/components/ui/AnimatedButton'
import CelebrationOverlay from '@/components/ui/CelebrationOverlay'
import { motion } from 'framer-motion'

interface LessonClientProps {
    lesson: FullLesson
    initialProgress: UserProgress | null
    user: User
}

export default function LessonClient({ lesson, initialProgress, user }: LessonClientProps) {
    const router = useRouter()
    const [currentTier, setCurrentTier] = useState(initialProgress?.current_tier || 1)
    const [score, setScore] = useState(initialProgress?.score || 0)
    const [xpEarned, setXpEarned] = useState(initialProgress?.xp_earned || 0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [textAnswer, setTextAnswer] = useState('')
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward')

    const tierContent = lesson.tier_content

    const resetAnswerState = useCallback(() => {
        setSelectedAnswer(null)
        setTextAnswer('')
        setShowFeedback(false)
        setIsCorrect(false)
    }, [])

    const handleNext = async () => {
        if (currentTier < 5) {
            setTransitionDirection('forward')
            setCurrentTier(currentTier + 1)
            resetAnswerState()
        } else {
            // Lesson completed - include tier 5 bonus XP
            const finalXp = xpEarned + tierContent.tier5.totalXpReward
            setXpEarned(finalXp)
            await updateProgress('completed', finalXp)
            router.push('/dashboard')
        }
    }

    const handlePrevious = () => {
        if (currentTier > 1) {
            setTransitionDirection('backward')
            setCurrentTier(currentTier - 1)
            resetAnswerState()
        }
    }

    const handleCheckAnswer = async (tier: number) => {
        let correct = false

        if (tier === 3) {
            // Multiple choice
            const selectedOption = tierContent.tier3.options.find((opt: any) => opt.id === selectedAnswer)
            correct = selectedOption?.isCorrect || false
            const reward = correct ? tierContent.tier3.xpReward : 0
            setXpEarned(xpEarned + reward)
        } else if (tier === 4) {
            // Fill in blank
            const acceptableAnswers = tierContent.tier4.acceptableAnswers || []
            correct = acceptableAnswers.some((ans: string) =>
                ans.toLowerCase().replace(/\s/g, '') === textAnswer.toLowerCase().replace(/\s/g, '')
            )
            const reward = correct ? tierContent.tier4.xpReward : 0
            setXpEarned(xpEarned + reward)
        }

        setIsCorrect(correct)
        setShowFeedback(true)

        if (correct) {
            setScore(score + 20)
        }

        await updateProgress('in_progress')
    }

    const updateProgress = async (status: string, overrideXp?: number) => {
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lesson_id: lesson.id,
                    current_tier: currentTier,
                    score,
                    xp_earned: overrideXp ?? xpEarned,
                    status,
                }),
            })
        } catch (error) {
            console.error('Failed to update progress:', error)
        }
    }

    useEffect(() => {
        if (currentTier === 5) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTier])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            &larr; Back to Dashboard
                        </button>
                        <div className="text-sm text-gray-600">
                            Tier {currentTier}/5
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
                    <p className="text-gray-600">🎵 {lesson.artist}</p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <TierTransition tierKey={currentTier} direction={transitionDirection}>
                    {/* Tier 1: Hook */}
                    {currentTier === 1 && (
                        <FadeIn>
                            <div className="card">
                                <h2 className="text-3xl font-bold mb-4">{tierContent.tier1.title}</h2>
                                <p className="text-lg text-gray-700 mb-6">{tierContent.tier1.text}</p>

                                <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 shadow-inner">
                                    {(tierContent.tier1.mediaType === 'youtube' && tierContent.tier1.imageUrl) ? (
                                        <div className="relative pt-[56.25%]">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${(() => {
                                                    const match = tierContent.tier1.imageUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
                                                    return (match && match[2].length === 11) ? match[2] : ''
                                                })()}`}
                                                className="absolute top-0 left-0 w-full h-full"
                                                title="Lesson Video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : tierContent.tier1.imageUrl ? (
                                        <img
                                            src={tierContent.tier1.imageUrl}
                                            alt={tierContent.tier1.title}
                                            className="w-full h-auto object-cover max-h-96"
                                        />
                                    ) : (
                                        <div className="h-64 flex items-center justify-center bg-gray-200">
                                            <span className="text-gray-500">Video or Image not available</span>
                                        </div>
                                    )}
                                </div>

                                <AnimatedButton variant="primary" fullWidth onClick={handleNext}>
                                    Let&apos;s Learn! →
                                </AnimatedButton>
                            </div>
                        </FadeIn>
                    )}

                    {/* Tier 2: Concept */}
                    {currentTier === 2 && (
                        <div className="card">
                            <h2 className="text-3xl font-bold mb-6">{tierContent.tier2.title}</h2>
                            <StaggerContainer staggerDelay={0.15} className="space-y-6 mb-6">
                                {tierContent.tier2.steps.map((step: any, index: number) => (
                                    <motion.div
                                        key={index}
                                        variants={staggerItemVariants}
                                        className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"
                                    >
                                        <div className="text-sm font-semibold text-kpop-purple mb-2">
                                            Step {step.stepNumber}
                                        </div>
                                        <p className="text-lg">{step.text}</p>
                                    </motion.div>
                                ))}
                            </StaggerContainer>
                            <div className="flex gap-4">
                                <AnimatedButton variant="secondary" fullWidth onClick={handlePrevious}>
                                    ← Previous
                                </AnimatedButton>
                                <AnimatedButton variant="primary" fullWidth onClick={handleNext}>
                                    Next →
                                </AnimatedButton>
                            </div>
                        </div>
                    )}

                    {/* Tier 3: Multiple Choice */}
                    {currentTier === 3 && (
                        <QuestionCard
                            type="multiple_choice"
                            questionText={tierContent.tier3.questionText}
                            options={tierContent.tier3.options}
                            selectedAnswer={selectedAnswer}
                            onSelectAnswer={id => !showFeedback && setSelectedAnswer(id)}
                            showFeedback={showFeedback}
                            isCorrect={isCorrect}
                            xpReward={tierContent.tier3.xpReward}
                            hint={tierContent.tier3.hint}
                            onCheckAnswer={() => handleCheckAnswer(3)}
                            onTryAgain={resetAnswerState}
                            onContinue={handleNext}
                            onPrevious={handlePrevious}
                            canCheck={!!selectedAnswer}
                        />
                    )}

                    {/* Tier 4: Fill in Blank */}
                    {currentTier === 4 && (
                        <QuestionCard
                            type="fill_in_blank"
                            questionText={tierContent.tier4.questionText}
                            textAnswer={textAnswer}
                            onTextChange={setTextAnswer}
                            inputType={tierContent.tier4.inputType === 'number' ? 'number' : 'text'}
                            onEnterSubmit={() => handleCheckAnswer(4)}
                            showFeedback={showFeedback}
                            isCorrect={isCorrect}
                            xpReward={tierContent.tier4.xpReward}
                            hint={tierContent.tier4.hint}
                            onCheckAnswer={() => handleCheckAnswer(4)}
                            onTryAgain={resetAnswerState}
                            onContinue={handleNext}
                            onPrevious={handlePrevious}
                            canCheck={!!textAnswer}
                        />
                    )}

                    {/* Tier 5: Celebration */}
                    {currentTier === 5 && (
                        <CelebrationOverlay
                            congratsText={tierContent.tier5.congratsText}
                            summaryText={tierContent.tier5.summaryText}
                            xpBreakdown={[
                                { label: 'Score', value: score, color: 'bg-purple-50' },
                                { label: 'XP', value: xpEarned, color: 'bg-pink-50' },
                            ]}
                            totalXp={xpEarned}
                            badgeEarned={tierContent.tier5.badgeEarned}
                            actions={
                                <AnimatedButton
                                    variant="primary"
                                    fullWidth
                                    onClick={handleNext}
                                    className="text-lg"
                                >
                                    Back to Dashboard
                                </AnimatedButton>
                            }
                        />
                    )}
                </TierTransition>
            </div>
        </div>
    )
}
