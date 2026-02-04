'use client'

import React, { useState } from 'react'
import { createLesson, updateLesson } from '../actions'
import type { TierContent } from '@/types/database.types'
import { Tier1Editor, Tier2Editor, Tier3Editor, Tier4Editor, Tier5Editor } from './TierEditors'
import TierBlockEditor from '@/components/lessons/TierBlockEditor'

const defaultTierContent: TierContent = {
    tier1: {
        tier: 1,
        title: 'Introduction',
        shortDescription: 'Basic concept introduction',
        learningObjective: 'Understand the core concept',
        estimatedMinutes: 5,
        text: '',
        imageUrl: '',
        duration: 30
    },
    tier2: {
        tier: 2,
        title: 'Step-by-Step',
        shortDescription: 'Guided walkthrough',
        learningObjective: 'Follow the process',
        estimatedMinutes: 10,
        steps: [{ stepNumber: 1, text: '', animation: 'fade-in' }],
        duration: 60
    },
    tier3: {
        tier: 3,
        title: 'Practice Quiz',
        shortDescription: 'Multiple choice questions',
        learningObjective: 'Test understanding',
        estimatedMinutes: 5,
        questionText: '',
        questionType: 'multiple_choice',
        options: [
            { id: 'a', text: '', isCorrect: true },
            { id: 'b', text: '', isCorrect: false },
            { id: 'c', text: '', isCorrect: false },
            { id: 'd', text: '', isCorrect: false }
        ],
        xpReward: 10,
        hint: ''
    },
    tier4: {
        tier: 4,
        title: 'Challenge',
        shortDescription: 'Fill in the blank',
        learningObjective: 'Apply knowledge',
        estimatedMinutes: 8,
        questionText: '',
        questionType: 'fill_in_blank',
        correctAnswer: '',
        acceptableAnswers: [],
        inputType: 'text',
        xpReward: 15,
        hint: ''
    },
    tier5: {
        tier: 5,
        title: 'Conclusion',
        shortDescription: 'Summary and Reward',
        learningObjective: 'Review and celebrate',
        estimatedMinutes: 2,
        congratsText: '',
        summaryText: '',
        totalXpReward: 50,
        badgeEarned: null,
        nextLessonId: null,
        celebrationAnimation: 'confetti'
    }
}

interface LessonFormProps {
    lessonId?: string
    initialData?: {
        title: string
        artist: string
        math_concept: string
        difficulty: 'beginner' | 'intermediate' | 'advanced'
        tier_content: TierContent
        is_published?: boolean
    }
}

export default function LessonForm({ lessonId, initialData }: LessonFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Interactive state for all tiers
    const [tierContent, setTierContent] = useState<TierContent>(
        initialData?.tier_content || defaultTierContent
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        // Convert the interactive object to JSON string for the server action
        formData.append('tier_content', JSON.stringify(tierContent))

        let result
        if (lessonId) {
            result = await updateLesson(lessonId, formData)
        } else {
            result = await createLesson(formData)
        }

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    const updateTier = (tierKey: keyof TierContent, data: any) => {
        setTierContent((prev: TierContent) => ({
            ...prev,
            [tierKey]: data
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Basic Lesson Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
                        <input
                            name="title"
                            required
                            defaultValue={initialData?.title}
                            className="input-field mt-1"
                            placeholder="e.g. Algebra with NewJeans"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Artist</label>
                        <input
                            name="artist"
                            required
                            defaultValue={initialData?.artist}
                            className="input-field mt-1"
                            placeholder="e.g. NewJeans"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Math Concept</label>
                        <input
                            name="math_concept"
                            required
                            defaultValue={initialData?.math_concept}
                            className="input-field mt-1"
                            placeholder="e.g. Combined Like Terms"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                        <select
                            name="difficulty"
                            defaultValue={initialData?.difficulty || 'beginner'}
                            className="input-field mt-1"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div className="flex items-center h-full pt-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_published"
                                value="true"
                                defaultChecked={initialData?.is_published}
                                className="w-5 h-5 text-kpop-purple rounded border-gray-300 focus:ring-kpop-purple"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Publish Lesson</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Interactive Tier Stack */}
            <div className="space-y-4">
                <TierBlockEditor
                    tierNumber={1}
                    data={tierContent.tier1}
                    onChange={(d) => updateTier('tier1', d)}
                    isDefaultOpen={true}
                >
                    <Tier1Editor data={tierContent.tier1} onChange={(d) => updateTier('tier1', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={2}
                    data={tierContent.tier2}
                    onChange={(d) => updateTier('tier2', d)}
                >
                    <Tier2Editor data={tierContent.tier2} onChange={(d) => updateTier('tier2', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={3}
                    data={tierContent.tier3}
                    onChange={(d) => updateTier('tier3', d)}
                >
                    <Tier3Editor data={tierContent.tier3} onChange={(d) => updateTier('tier3', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={4}
                    data={tierContent.tier4}
                    onChange={(d) => updateTier('tier4', d)}
                >
                    <Tier4Editor data={tierContent.tier4} onChange={(d) => updateTier('tier4', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={5}
                    data={tierContent.tier5}
                    onChange={(d) => updateTier('tier5', d)}
                >
                    <Tier5Editor data={tierContent.tier5} onChange={(d) => updateTier('tier5', d)} />
                </TierBlockEditor>
            </div>

            <div className="flex justify-between items-center mt-8 sticky bottom-0 bg-white/90 backdrop-blur p-4 border-t z-10">
                <div className="text-sm text-gray-500">
                    💡 각 Tier의 내용을 꼼꼼히 작성해 주세요. 완료되면 우측 하단 버튼을 누르세요.
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary min-w-[140px]"
                    >
                        {loading ? 'Processing...' : (lessonId ? 'Save Changes' : 'Create Lesson')}
                    </button>
                </div>
            </div>
        </form>
    )
}
