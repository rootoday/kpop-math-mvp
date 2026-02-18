'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAIQuestionGenerator } from '@/lib/hooks/useAIQuestionGenerator'
import type { Lesson, UserProgress } from '@/types'

interface AIQuickGenerateProps {
    lessons: Lesson[]
    progress: UserProgress[]
}

const TOPIC_MAP: Record<string, string> = {
    algebra: 'algebra',
    geometry: 'geometry',
    fractions: 'fractions',
    percentages: 'percentages',
    ratios: 'ratios',
    statistics: 'statistics',
}

function mapConceptToTopic(mathConcept: string): string {
    const lower = mathConcept.toLowerCase()
    for (const [keyword, topic] of Object.entries(TOPIC_MAP)) {
        if (lower.includes(keyword)) return topic
    }
    return 'algebra'
}

function mapDifficulty(difficulty: string): number {
    switch (difficulty) {
        case 'beginner': return 2
        case 'intermediate': return 3
        case 'advanced': return 4
        default: return 3
    }
}

export default function AIQuickGenerate({ lessons, progress }: AIQuickGenerateProps) {
    const router = useRouter()
    const { loading, error, data: question, generateQuestion, reset } = useAIQuestionGenerator()
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

    // Find the lesson the user is currently working on
    const currentLesson = useMemo(() => {
        // Find in-progress lessons (started but not at tier 5)
        const inProgressIds = progress
            .filter(p => p.current_tier >= 1 && p.current_tier < 5)
            .sort((a, b) => {
                const dateA = a.last_accessed ? new Date(a.last_accessed).getTime() : 0
                const dateB = b.last_accessed ? new Date(b.last_accessed).getTime() : 0
                return dateB - dateA
            })
            .map(p => p.lesson_id)

        if (inProgressIds.length > 0) {
            return lessons.find(l => l.id === inProgressIds[0]) ?? null
        }

        // Fallback: first published lesson
        return lessons.find(l => l.is_published) ?? lessons[0] ?? null
    }, [lessons, progress])

    const handleQuickGenerate = () => {
        reset()
        setSelectedAnswer(null)

        const topic = currentLesson ? mapConceptToTopic(currentLesson.math_concept) : 'algebra'
        const difficulty = currentLesson ? mapDifficulty(currentLesson.difficulty) : 3
        const artistName = currentLesson?.artist ?? 'NewJeans'

        generateQuestion({ topic, difficulty, artistName })
    }

    const handleGoToLesson = () => {
        if (currentLesson) {
            router.push(`/learn/${currentLesson.id}`)
        }
    }

    return (
        <div className="card relative overflow-hidden">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kpop-purple to-kpop-red flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">AI Practice</h3>
                        <p className="text-xs text-gray-500">Powered by Claude</p>
                    </div>
                </div>

                {currentLesson && (
                    <span className="text-xs bg-kpop-purple/10 text-kpop-purple px-2.5 py-1 rounded-full font-medium">
                        {currentLesson.artist}
                    </span>
                )}
            </div>

            {/* Current lesson context */}
            {currentLesson && !question && !loading && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Based on your current lesson
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{currentLesson.title}</p>
                    <p className="text-xs text-gray-500">{currentLesson.math_concept}</p>
                </div>
            )}

            {/* Quick generate button */}
            {!question && !loading && (
                <button
                    onClick={handleQuickGenerate}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Practice
                </button>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col items-center py-6 gap-3">
                    <div className="w-8 h-8 border-3 border-kpop-purple/30 border-t-kpop-purple rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Generating a question...</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p>{error}</p>
                        <button
                            onClick={handleQuickGenerate}
                            className="mt-2 text-xs text-red-600 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* Generated question */}
            {question && (
                <div className="space-y-3 animate-fade-in">
                    {/* Question text */}
                    <p className="text-sm font-medium text-gray-800">{question.question}</p>

                    {/* Answer choices */}
                    <div className="space-y-2">
                        {question.choices.map((choice, i) => {
                            const isSelected = selectedAnswer === choice
                            const isCorrect = choice === question.correctAnswer
                            const showResult = selectedAnswer !== null

                            let className = 'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all '
                            if (!showResult) {
                                className += 'border-gray-200 hover:border-kpop-purple/50 hover:bg-kpop-purple/5 cursor-pointer'
                            } else if (isCorrect) {
                                className += 'border-green-300 bg-green-50 text-green-800'
                            } else if (isSelected && !isCorrect) {
                                className += 'border-red-300 bg-red-50 text-red-800'
                            } else {
                                className += 'border-gray-100 text-gray-400'
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => !showResult && setSelectedAnswer(choice)}
                                    disabled={showResult}
                                    className={className}
                                >
                                    <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                                    {choice}
                                    {showResult && isCorrect && (
                                        <svg className="w-4 h-4 text-green-500 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                        <svg className="w-4 h-4 text-red-500 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Explanation (shown after answering) */}
                    {selectedAnswer && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 animate-fade-in">
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Explanation
                            </div>
                            <p>{question.explanation}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={handleQuickGenerate}
                            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            New Question
                        </button>
                        {currentLesson && (
                            <button
                                onClick={handleGoToLesson}
                                className="flex-1 btn-primary text-sm flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                Go to Lesson
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
