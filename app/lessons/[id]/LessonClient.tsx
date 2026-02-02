'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Lesson, UserProgress, User } from '@/types'
import confetti from 'canvas-confetti'

interface LessonClientProps {
    lesson: Lesson
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

    const tierContent = lesson.tier_content as any

    const handleNext = async () => {
        if (currentTier < 5) {
            setCurrentTier(currentTier + 1)
            setShowFeedback(false)
            setSelectedAnswer(null)
            setTextAnswer('')
        } else {
            // Lesson completed
            await updateProgress('completed')
            router.push('/dashboard')
        }
    }

    const handlePrevious = () => {
        if (currentTier > 1) {
            setCurrentTier(currentTier - 1)
            setShowFeedback(false)
            setSelectedAnswer(null)
            setTextAnswer('')
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

    const updateProgress = async (status: string) => {
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lesson_id: lesson.id,
                    current_tier: currentTier,
                    score,
                    xp_earned: xpEarned,
                    status,
                }),
            })
        } catch (error) {
            console.error('Failed to update progress:', error)
        }
    }

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    useEffect(() => {
        if (currentTier === 5) {
            triggerConfetti()
        }
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
                            ← Back to Dashboard
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
                {/* Tier 1: Hook */}
                {currentTier === 1 && (
                    <div className="card animate-fade-in">
                        <h2 className="text-3xl font-bold mb-4">{tierContent.tier1.title}</h2>
                        <p className="text-lg text-gray-700 mb-6">{tierContent.tier1.text}</p>
                        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-6">
                            <span className="text-gray-500">🎵 {lesson.artist} Image</span>
                        </div>
                        <button onClick={handleNext} className="btn-primary w-full">
                            Let's Learn! →
                        </button>
                    </div>
                )}

                {/* Tier 2: Concept */}
                {currentTier === 2 && (
                    <div className="card animate-fade-in">
                        <h2 className="text-3xl font-bold mb-6">{tierContent.tier2.title}</h2>
                        <div className="space-y-6">
                            {tierContent.tier2.steps.map((step: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg animate-slide-up"
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className="text-sm font-semibold text-kpop-purple mb-2">
                                        Step {step.stepNumber}
                                    </div>
                                    <p className="text-lg">{step.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handlePrevious} className="btn-secondary flex-1">
                                ← Previous
                            </button>
                            <button onClick={handleNext} className="btn-primary flex-1">
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* Tier 3: Multiple Choice */}
                {currentTier === 3 && (
                    <div className="card animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Practice Time! 🎯</h2>
                        <p className="text-lg mb-6">{tierContent.tier3.questionText}</p>
                        <div className="space-y-3 mb-6">
                            {tierContent.tier3.options.map((option: any) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedAnswer(option.id)}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswer === option.id
                                            ? 'border-kpop-purple bg-purple-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>

                        {showFeedback && (
                            <div
                                className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {isCorrect ? '✅ Correct! Great job!' : '❌ Not quite. Try again!'}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button onClick={handlePrevious} className="btn-secondary flex-1">
                                ← Previous
                            </button>
                            {!showFeedback ? (
                                <button
                                    onClick={() => handleCheckAnswer(3)}
                                    disabled={!selectedAnswer}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button onClick={handleNext} className="btn-primary flex-1">
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Tier 4: Fill in Blank */}
                {currentTier === 4 && (
                    <div className="card animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Challenge! 💪</h2>
                        <p className="text-lg mb-6">{tierContent.tier4.questionText}</p>
                        <input
                            type="text"
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            placeholder="Enter your answer..."
                            className="input-field mb-6"
                        />

                        {showFeedback && (
                            <div
                                className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {isCorrect
                                    ? '✅ Perfect! You got it!'
                                    : `❌ Not quite. Hint: ${tierContent.tier4.hint}`}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button onClick={handlePrevious} className="btn-secondary flex-1">
                                ← Previous
                            </button>
                            {!showFeedback ? (
                                <button
                                    onClick={() => handleCheckAnswer(4)}
                                    disabled={!textAnswer}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button onClick={handleNext} className="btn-primary flex-1">
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Tier 5: Celebration */}
                {currentTier === 5 && (
                    <div className="card text-center animate-fade-in">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold mb-4">{tierContent.tier5.congratsText}</h2>
                        <p className="text-lg text-gray-700 mb-8">{tierContent.tier5.summaryText}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-purple-100 rounded-lg">
                                <div className="text-3xl font-bold text-kpop-purple">{score}/100</div>
                                <div className="text-sm text-gray-600">Score</div>
                            </div>
                            <div className="p-4 bg-purple-100 rounded-lg">
                                <div className="text-3xl font-bold text-kpop-purple">+{xpEarned}</div>
                                <div className="text-sm text-gray-600">XP Earned</div>
                            </div>
                        </div>

                        <button onClick={handleNext} className="btn-primary w-full">
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
