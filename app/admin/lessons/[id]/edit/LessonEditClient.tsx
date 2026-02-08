'use client'

import { useState, useCallback } from 'react'
import LessonForm from '../../new/LessonForm'
import AIQuestionGeneratorModal from '../../AIQuestionGeneratorModal'
import type { TierContent } from '@/types/database.types'
import type { AIQuestion } from '@/types/ai'

interface LessonEditClientProps {
    lessonId: string
    initialData: {
        title: string
        artist: string
        math_concept: string
        difficulty: 'beginner' | 'intermediate' | 'advanced'
        tier_content: TierContent
        is_published?: boolean
    }
}

interface Toast {
    type: 'success' | 'error'
    message: string
}

export default function LessonEditClient({ lessonId, initialData }: LessonEditClientProps) {
    const [isAIModalOpen, setIsAIModalOpen] = useState(false)
    const [toast, setToast] = useState<Toast | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const showToast = useCallback((type: Toast['type'], message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 4000)
    }, [])

    const handleAddToLesson = useCallback(async (question: AIQuestion) => {
        setIsSaving(true)
        setIsAIModalOpen(false)

        try {
            const res = await fetch(`/api/lessons/${lessonId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                showToast('error', data.error ?? 'Failed to add question to lesson')
                return
            }

            showToast('success', `Question added to lesson! (${data.data.questionsCount} total)`)
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Network error')
        } finally {
            setIsSaving(false)
        }
    }, [lessonId, showToast])

    return (
        <>
            {/* AI Generate Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsAIModalOpen(true)}
                    disabled={isSaving}
                    className="py-2 px-4 bg-gradient-to-r from-kpop-purple to-kpop-red text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 text-sm disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI Question Generator
                        </>
                    )}
                </button>
            </div>

            {/* Lesson Form */}
            <LessonForm
                lessonId={lessonId}
                initialData={initialData}
            />

            {/* AI Modal */}
            <AIQuestionGeneratorModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onAddToLesson={handleAddToLesson}
            />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] animate-fade-in">
                    <div
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
                            toast.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
