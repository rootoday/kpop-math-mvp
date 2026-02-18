'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FullLesson, TierLevel, BaseTier, UserProgress, User } from '@/types'
import confetti from 'canvas-confetti'
import ProgressBar from './components/ProgressBar'
import TierHeader from './components/TierHeader'
import TierTransition from '@/components/animations/TierTransition'
import FadeIn from '@/components/animations/FadeIn'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'
import QuestionCard from '@/components/ui/QuestionCard'
import AnimatedButton from '@/components/ui/AnimatedButton'
import CelebrationOverlay from '@/components/ui/CelebrationOverlay'
import { motion } from 'framer-motion'

interface LessonPlayerProps {
    lesson: FullLesson
    initialProgress: UserProgress | null
    user: User
}

export default function LessonPlayer({ lesson, initialProgress }: LessonPlayerProps) {
    const router = useRouter()
    const tc = lesson.tier_content

    // --- State ---
    const [currentTier, setCurrentTier] = useState<TierLevel>(
        (initialProgress?.current_tier as TierLevel) || 1
    )
    const [completedTiers, setCompletedTiers] = useState<Set<number>>(() => {
        const initial = new Set<number>()
        if (initialProgress?.current_tier) {
            for (let t = 1; t < initialProgress.current_tier; t++) {
                initial.add(t)
            }
        }
        return initial
    })
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [textAnswer, setTextAnswer] = useState('')
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState(initialProgress?.score || 0)
    const [totalXp, setTotalXp] = useState(initialProgress?.xp_earned || 0)
    const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward')

    // --- Helpers ---
    const tierKeys: Record<TierLevel, keyof typeof tc> = {
        1: 'tier1', 2: 'tier2', 3: 'tier3', 4: 'tier4', 5: 'tier5',
    }

    const currentTierData = tc[tierKeys[currentTier]]
    const baseTier = currentTierData as BaseTier

    const tierTitles = [tc.tier1.title, tc.tier2.title, tc.tier3.title, tc.tier4.title, tc.tier5.title]

    const resetAnswerState = useCallback(() => {
        setSelectedAnswer(null)
        setTextAnswer('')
        setShowFeedback(false)
        setIsCorrect(false)
    }, [])

    // --- Progress Persistence ---
    const updateProgress = async (status: string) => {
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lesson_id: lesson.id,
                    current_tier: currentTier,
                    score,
                    xp_earned: totalXp,
                    status,
                }),
            })
        } catch (error) {
            console.error('Failed to update progress:', error)
        }
    }

    // --- Navigation ---
    const handleCompleteTier = () => {
        setCompletedTiers(prev => {
            const next = new Set(prev)
            next.add(currentTier)
            return next
        })
        if (currentTier < 5) {
            setTransitionDirection('forward')
            setCurrentTier((currentTier + 1) as TierLevel)
            resetAnswerState()
        }
    }

    const handlePrevious = () => {
        if (currentTier > 1) {
            setTransitionDirection('backward')
            setCurrentTier((currentTier - 1) as TierLevel)
            resetAnswerState()
        }
    }

    const handleTierClick = (tier: TierLevel) => {
        setTransitionDirection(tier > currentTier ? 'forward' : 'backward')
        setCurrentTier(tier)
        resetAnswerState()
    }

    // --- Answer Checking ---
    const handleCheckAnswer = () => {
        if (currentTier === 3) {
            const opt = tc.tier3.options.find(o => o.id === selectedAnswer)
            const correct = opt?.isCorrect || false
            setIsCorrect(correct)
            setShowFeedback(true)
            if (correct) {
                setTotalXp(prev => prev + tc.tier3.xpReward)
                setScore(prev => prev + 20)
            }
        } else if (currentTier === 4) {
            const normalized = textAnswer.toLowerCase().replace(/\s/g, '')
            const correct = tc.tier4.acceptableAnswers.some(
                a => a.toLowerCase().replace(/\s/g, '') === normalized
            )
            setIsCorrect(correct)
            setShowFeedback(true)
            if (correct) {
                setTotalXp(prev => prev + tc.tier4.xpReward)
                setScore(prev => prev + 20)
            }
        }
        updateProgress('in_progress')
    }

    // --- Confetti on Tier 5 ---
    useEffect(() => {
        if (currentTier === 5) {
            setTotalXp(prev => prev + tc.tier5.totalXpReward)
            setCompletedTiers(prev => {
                const next = new Set(prev)
                next.add(5)
                return next
            })
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
            updateProgress('completed')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTier])

    // --- Can complete current tier? ---
    const canComplete = (): boolean => {
        if (currentTier === 3) return showFeedback && isCorrect
        if (currentTier === 4) return showFeedback && isCorrect
        if (currentTier === 5) return false // auto-completed
        return true // tier 1, 2 always completable
    }

    // ==============================================
    // RENDER
    // ==============================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-500 hover:text-gray-900 text-sm flex items-center gap-1"
                        >
                            ← Dashboard
                        </button>
                        <span className={`badge badge-${lesson.difficulty}`}>
                            {lesson.difficulty}
                        </span>
                    </div>
                    <h1 className="text-lg font-bold mt-1">{lesson.title}</h1>
                    <p className="text-sm text-gray-500">🎵 {lesson.artist} · {lesson.math_concept}</p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-4xl mx-auto px-4 pb-2">
                    <ProgressBar
                        currentTier={currentTier}
                        completedTiers={completedTiers}
                        onTierClick={handleTierClick}
                        titles={tierTitles}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Tier Header (BaseTier metadata) */}
                <TierHeader
                    tier={baseTier.tier || currentTier}
                    title={baseTier.title}
                    shortDescription={baseTier.shortDescription || ''}
                    learningObjective={baseTier.learningObjective || ''}
                    estimatedMinutes={baseTier.estimatedMinutes || 0}
                />

                {/* Tier Content with Transition */}
                <TierTransition tierKey={currentTier} direction={transitionDirection}>
                    {/* ========== Tier 1: Introduction ========== */}
                    {currentTier === 1 && (
                        <FadeIn>
                            <div className="card">
                                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                    {tc.tier1.text}
                                </p>

                                <div className="rounded-lg overflow-hidden mb-6 bg-gray-100 shadow-inner">
                                    {(tc.tier1.mediaType === 'youtube' && tc.tier1.imageUrl) ? (
                                        <div className="relative pt-[56.25%]">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${(() => {
                                                    const match = tc.tier1.imageUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
                                                    return (match && match[2].length === 11) ? match[2] : ''
                                                })()}`}
                                                className="absolute top-0 left-0 w-full h-full"
                                                title="Lesson Video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : tc.tier1.imageUrl ? (
                                        <img
                                            src={tc.tier1.imageUrl}
                                            alt={tc.tier1.title}
                                            className="w-full h-auto object-cover max-h-96"
                                        />
                                    ) : (
                                        <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                                            <span className="text-gray-500 text-lg">🎵 {lesson.artist}</span>
                                        </div>
                                    )}
                                </div>

                                <AnimatedButton variant="primary" fullWidth onClick={handleCompleteTier}>
                                    Let&apos;s Learn! →
                                </AnimatedButton>
                            </div>
                        </FadeIn>
                    )}

                    {/* ========== Tier 2: Concept Steps ========== */}
                    {currentTier === 2 && (
                        <div className="card">
                            <StaggerContainer staggerDelay={0.15} className="space-y-4 mb-6">
                                {tc.tier2.steps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        variants={staggerItemVariants}
                                        className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg
                                                   border-l-4 border-kpop-purple"
                                    >
                                        <span className="inline-block bg-kpop-purple text-white text-xs
                                                         font-bold px-2 py-1 rounded-full mb-2">
                                            Step {step.stepNumber}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed">{step.text}</p>
                                    </motion.div>
                                ))}
                            </StaggerContainer>
                            <div className="flex gap-3">
                                <AnimatedButton variant="secondary" fullWidth onClick={handlePrevious}>
                                    ← Previous
                                </AnimatedButton>
                                <AnimatedButton variant="primary" fullWidth onClick={handleCompleteTier}>
                                    Complete Tier →
                                </AnimatedButton>
                            </div>
                        </div>
                    )}

                    {/* ========== Tier 3: Multiple Choice ========== */}
                    {currentTier === 3 && (
                        <QuestionCard
                            type="multiple_choice"
                            questionText={tc.tier3.questionText}
                            options={tc.tier3.options}
                            selectedAnswer={selectedAnswer}
                            onSelectAnswer={id => !showFeedback && setSelectedAnswer(id)}
                            showFeedback={showFeedback}
                            isCorrect={isCorrect}
                            xpReward={tc.tier3.xpReward}
                            hint={tc.tier3.hint}
                            onCheckAnswer={handleCheckAnswer}
                            onTryAgain={resetAnswerState}
                            onContinue={handleCompleteTier}
                            onPrevious={handlePrevious}
                            canCheck={!!selectedAnswer}
                        />
                    )}

                    {/* ========== Tier 4: Fill in the Blank ========== */}
                    {currentTier === 4 && (
                        <QuestionCard
                            type="fill_in_blank"
                            questionText={tc.tier4.questionText}
                            textAnswer={textAnswer}
                            onTextChange={setTextAnswer}
                            inputType={tc.tier4.inputType === 'number' ? 'number' : 'text'}
                            onEnterSubmit={handleCheckAnswer}
                            showFeedback={showFeedback}
                            isCorrect={isCorrect}
                            xpReward={tc.tier4.xpReward}
                            hint={tc.tier4.hint}
                            onCheckAnswer={handleCheckAnswer}
                            onTryAgain={resetAnswerState}
                            onContinue={handleCompleteTier}
                            onPrevious={handlePrevious}
                            canCheck={!!textAnswer}
                        />
                    )}

                    {/* ========== Tier 5: Celebration ========== */}
                    {currentTier === 5 && (
                        <CelebrationOverlay
                            congratsText={tc.tier5.congratsText}
                            summaryText={tc.tier5.summaryText}
                            xpBreakdown={[
                                { label: 'Quiz', value: tc.tier3.xpReward, color: 'bg-purple-50' },
                                { label: 'Challenge', value: tc.tier4.xpReward, color: 'bg-purple-50' },
                                { label: 'Bonus', value: tc.tier5.totalXpReward, color: 'bg-pink-50' },
                            ]}
                            totalXp={totalXp}
                            badgeEarned={tc.tier5.badgeEarned}
                            actions={
                                <>
                                    <AnimatedButton
                                        variant="primary"
                                        fullWidth
                                        onClick={() => router.push('/dashboard')}
                                        className="text-lg"
                                    >
                                        Back to Dashboard
                                    </AnimatedButton>
                                    {tc.tier5.nextLessonId && (
                                        <AnimatedButton
                                            variant="secondary"
                                            fullWidth
                                            onClick={() => router.push(`/learn/${tc.tier5.nextLessonId}`)}
                                            className="text-lg"
                                        >
                                            Next Lesson →
                                        </AnimatedButton>
                                    )}
                                </>
                            }
                        />
                    )}
                </TierTransition>
            </main>
        </div>
    )
}
