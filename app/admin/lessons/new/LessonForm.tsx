'use client'

import { useState } from 'react'
import { createLesson } from '../actions'
import type { TierContent } from '@/types'

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

    // Using a simplified approach: text area for JSON content but with basic fields outside
    // This ensures we get the structure right while keeping the UI manageable for now
    const [jsonContent, setJsonContent] = useState(JSON.stringify(initialTierContent, null, 2))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        formData.append('tier_content', jsonContent)

        const result = await createLesson(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

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

            <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier Content (JSON Structure)
                </label>
                <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded">
                    💡 5단계 레슨의 세부 내용(텍스트, 이미지, 퀴즈)을 JSON 형식으로 작성합니다.
                </div>
                <textarea
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    rows={20}
                    className="w-full p-4 font-mono text-sm border border-gray-300 rounded-md focus:ring-kpop-purple focus:border-kpop-purple"
                />
            </div>

            <div className="flex justify-end gap-4 mt-8">
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
                    className="btn-primary"
                >
                    {loading ? 'Creating...' : 'Create Lesson'}
                </button>
            </div>
        </form>
    )
}
