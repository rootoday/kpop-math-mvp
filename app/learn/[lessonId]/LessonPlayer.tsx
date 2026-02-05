'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { FullLesson, TierLevel, BaseTier } from '@/types'
import confetti from 'canvas-confetti'
import ProgressBar from './components/ProgressBar'
import TierHeader from './components/TierHeader'

interface LessonPlayerProps {
    lesson: FullLesson
}

export default function LessonPlayer({ lesson }: LessonPlayerProps) {
    const router = useRouter()
    const tc = lesson.tier_content

    // --- State ---
    const [currentTier, setCurrentTier] = useState<TierLevel>(1)
    const [completedTiers, setCompletedTiers] = useState<Set<number>>(new Set())
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [textAnswer, setTextAnswer] = useState('')
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [totalXp, setTotalXp] = useState(0)

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

    // --- Navigation ---
    const handleCompleteTier = () => {
        setCompletedTiers(prev => {
            const next = new Set(prev)
            next.add(currentTier)
            return next
        })
        if (currentTier < 5) {
            setCurrentTier((currentTier + 1) as TierLevel)
            resetAnswerState()
        }
    }

    const handlePrevious = () => {
        if (currentTier > 1) {
            setCurrentTier((currentTier - 1) as TierLevel)
            resetAnswerState()
        }
    }

    const handleTierClick = (tier: TierLevel) => {
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
            }
        }
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

                {/* Tier Content */}
                <div className="animate-fade-in">
                    {/* ========== Tier 1: Introduction ========== */}
                    {currentTier === 1 && (
                        <div className="card">
                            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                {tc.tier1.text}
                            </p>
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-48
                                            flex items-center justify-center mb-6">
                                <span className="text-gray-500 text-lg">🎵 {lesson.artist}</span>
                            </div>
                            <button onClick={handleCompleteTier} className="btn-primary w-full text-lg">
                                Let&apos;s Learn! →
                            </button>
                        </div>
                    )}

                    {/* ========== Tier 2: Concept Steps ========== */}
                    {currentTier === 2 && (
                        <div className="card">
                            <div className="space-y-4 mb-6">
                                {tc.tier2.steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg
                                                   animate-slide-up border-l-4 border-kpop-purple"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    >
                                        <span className="inline-block bg-kpop-purple text-white text-xs
                                                         font-bold px-2 py-1 rounded-full mb-2">
                                            Step {step.stepNumber}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handlePrevious} className="btn-secondary flex-1">
                                    ← Previous
                                </button>
                                <button onClick={handleCompleteTier} className="btn-primary flex-1">
                                    Complete Tier →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========== Tier 3: Multiple Choice ========== */}
                    {currentTier === 3 && (
                        <div className="card">
                            <p className="text-lg font-medium mb-6">{tc.tier3.questionText}</p>

                            <div className="space-y-3 mb-6">
                                {tc.tier3.options.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => !showFeedback && setSelectedAnswer(option.id)}
                                        disabled={showFeedback}
                                        className={`w-full p-4 text-left rounded-lg border-2 transition-all
                                            ${showFeedback && option.isCorrect
                                                ? 'border-music-green bg-green-50'
                                                : showFeedback && option.id === selectedAnswer && !option.isCorrect
                                                    ? 'border-red-400 bg-red-50'
                                                    : selectedAnswer === option.id
                                                        ? 'border-kpop-purple bg-purple-50'
                                                        : 'border-gray-200 hover:border-gray-400'
                                            }
                                            ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                                    >
                                        <span className="font-medium text-gray-400 mr-3">
                                            {option.id.toUpperCase()}.
                                        </span>
                                        {option.text}
                                    </button>
                                ))}
                            </div>

                            {showFeedback && (
                                <div className={`p-4 rounded-lg mb-4 animate-fade-in ${
                                    isCorrect
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {isCorrect
                                        ? `✅ Correct! +${tc.tier3.xpReward} XP`
                                        : `❌ Not quite. ${tc.tier3.hint ? `Hint: ${tc.tier3.hint}` : 'Try again!'}`
                                    }
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={handlePrevious} className="btn-secondary flex-1">
                                    ← Previous
                                </button>
                                {!showFeedback ? (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={!selectedAnswer}
                                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Check Answer
                                    </button>
                                ) : isCorrect ? (
                                    <button onClick={handleCompleteTier} className="btn-primary flex-1">
                                        Continue →
                                    </button>
                                ) : (
                                    <button
                                        onClick={resetAnswerState}
                                        className="btn-primary flex-1"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========== Tier 4: Fill in the Blank ========== */}
                    {currentTier === 4 && (
                        <div className="card">
                            <p className="text-lg font-medium mb-6">{tc.tier4.questionText}</p>

                            <input
                                type={tc.tier4.inputType === 'number' ? 'number' : 'text'}
                                value={textAnswer}
                                onChange={e => setTextAnswer(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && textAnswer && !showFeedback && handleCheckAnswer()}
                                placeholder="Type your answer..."
                                className="input-field mb-6 text-lg"
                                disabled={showFeedback && isCorrect}
                            />

                            {showFeedback && (
                                <div className={`p-4 rounded-lg mb-4 animate-fade-in ${
                                    isCorrect
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {isCorrect
                                        ? `✅ Perfect! +${tc.tier4.xpReward} XP`
                                        : `❌ Not quite. Hint: ${tc.tier4.hint}`
                                    }
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={handlePrevious} className="btn-secondary flex-1">
                                    ← Previous
                                </button>
                                {!showFeedback ? (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={!textAnswer}
                                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Check Answer
                                    </button>
                                ) : isCorrect ? (
                                    <button onClick={handleCompleteTier} className="btn-primary flex-1">
                                        Continue →
                                    </button>
                                ) : (
                                    <button
                                        onClick={resetAnswerState}
                                        className="btn-primary flex-1"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========== Tier 5: Celebration ========== */}
                    {currentTier === 5 && (
                        <div className="card text-center">
                            <div className="text-7xl mb-4">🎉</div>
                            <h2 className="text-3xl font-bold mb-3 text-gradient">
                                {tc.tier5.congratsText}
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">{tc.tier5.summaryText}</p>

                            {/* XP Summary */}
                            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-kpop-purple">
                                        +{tc.tier3.xpReward}
                                    </div>
                                    <div className="text-xs text-gray-500">Quiz</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-kpop-purple">
                                        +{tc.tier4.xpReward}
                                    </div>
                                    <div className="text-xs text-gray-500">Challenge</div>
                                </div>
                                <div className="p-4 bg-pink-50 rounded-lg">
                                    <div className="text-2xl font-bold text-kpop-red">
                                        +{tc.tier5.totalXpReward}
                                    </div>
                                    <div className="text-xs text-gray-500">Bonus</div>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-6">
                                <div className="text-3xl font-bold text-gradient">
                                    Total: {totalXp} XP
                                </div>
                                {tc.tier5.badgeEarned && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        🏆 Badge earned: {tc.tier5.badgeEarned}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="btn-primary flex-1 text-lg"
                                >
                                    Back to Dashboard
                                </button>
                                {tc.tier5.nextLessonId && (
                                    <button
                                        onClick={() => router.push(`/learn/${tc.tier5.nextLessonId}`)}
                                        className="btn-secondary flex-1 text-lg"
                                    >
                                        Next Lesson →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
