'use client'

import { useState } from 'react'
import { createLesson } from '../actions'
import type { TierContent } from '@/types'
import { Tier1Editor, Tier2Editor, Tier3Editor, Tier4Editor, Tier5Editor } from './TierEditors'

const initialTierContent: TierContent = {
    tier1: {
        title: '',
        text: '',
        imageUrl: '',
        duration: 30
    },
    tier2: {
        title: '',
        steps: [{ stepNumber: 1, text: '', animation: 'fade-in' }],
        duration: 60
    },
    tier3: {
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
        questionText: '',
        questionType: 'fill_in_blank',
        correctAnswer: '',
        acceptableAnswers: [],
        inputType: 'text',
        xpReward: 15,
        hint: ''
    },
    tier5: {
        congratsText: '',
        summaryText: '',
        totalXpReward: 50,
        badgeEarned: null,
        nextLessonId: null,
        celebrationAnimation: 'confetti'
    }
}

export default function LessonForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState(1)

    // Interactive state for all tiers
    const [tierContent, setTierContent] = useState<TierContent>(initialTierContent)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        // Convert the interactive object to JSON string for the server action
        formData.append('tier_content', JSON.stringify(tierContent))

        const result = await createLesson(formData)
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
                        <input name="title" required className="input-field mt-1" placeholder="e.g. Algebra with NewJeans" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Artist</label>
                        <input name="artist" required className="input-field mt-1" placeholder="e.g. NewJeans" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Math Concept</label>
                        <input name="math_concept" required className="input-field mt-1" placeholder="e.g. Combined Like Terms" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                        <select name="difficulty" className="input-field mt-1">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Interactive Tier Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b overflow-x-auto bg-gray-50">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setActiveTab(num)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === num
                                ? 'border-kpop-purple text-kpop-purple bg-white'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Tier {num}
                            <span className="ml-2 text-[10px] opacity-60">
                                {num === 1 ? 'Intro' : num === 2 ? 'Steps' : num === 3 ? 'MCQ' : num === 4 ? 'Blank' : 'Reward'}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {activeTab === 1 && (
                        <Tier1Editor
                            data={tierContent.tier1}
                            onChange={(data) => updateTier('tier1', data)}
                        />
                    )}
                    {activeTab === 2 && (
                        <Tier2Editor
                            data={tierContent.tier2}
                            onChange={(data) => updateTier('tier2', data)}
                        />
                    )}
                    {activeTab === 3 && (
                        <Tier3Editor
                            data={tierContent.tier3}
                            onChange={(data) => updateTier('tier3', data)}
                        />
                    )}
                    {activeTab === 4 && (
                        <Tier4Editor
                            data={tierContent.tier4}
                            onChange={(data) => updateTier('tier4', data)}
                        />
                    )}
                    {activeTab === 5 && (
                        <Tier5Editor
                            data={tierContent.tier5}
                            onChange={(data) => updateTier('tier5', data)}
                        />
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-500">
                    💡 탭을 옮겨가며 5단계 내용을 모두 작성해 주세요. 내용을 모두 작성한 후 &apos;Create Lesson&apos;을 클릭하세요.
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
                        {loading ? 'Creating...' : 'Create Lesson'}
                    </button>
                </div>
            </div>
        </form>
    )
}
