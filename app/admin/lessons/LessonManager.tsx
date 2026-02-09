'use client'

import { useState } from 'react'
import { getLesson } from './actions'
import LessonForm from './new/LessonForm'
import AIQuestionGeneratorModal from './AIQuestionGeneratorModal'
import type { Database } from '@/types/database.types'
import type { AIQuestion } from '@/types/ai'

type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonManagerProps {
    initialLessons: Lesson[]
}

export default function LessonManager({ initialLessons }: LessonManagerProps) {
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
    const [editorData, setEditorData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isAIModalOpen, setIsAIModalOpen] = useState(false)
    const [lastAIQuestion, setLastAIQuestion] = useState<AIQuestion | null>(null)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [isSavingAI, setIsSavingAI] = useState(false)

    const filteredLessons = initialLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectLesson = async (id: string) => {
        setIsLoading(true)
        setSelectedLessonId(id)

        const { data, error } = await getLesson(id)

        if (data) {
            setEditorData(data)
        } else {
            console.error('Error fetching lesson:', error)
            // Optional: Show toast
        }
        setIsLoading(false)
    }

    const handleCreateNew = () => {
        setSelectedLessonId(null)
        setEditorData(null)
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* LEFT PANE: Lesson List */}
            <div className="w-1/3 bg-white rounded-xl shadow-kpop border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                    <button
                        onClick={handleCreateNew}
                        className="w-full btn-primary mb-2"
                    >
                        + Create New Lesson
                    </button>
                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="w-full mb-4 py-2 px-4 bg-gradient-to-r from-kpop-purple to-kpop-red text-white font-bold rounded-xl hover:opacity-90 hover:shadow-kpop transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AI Question Generator
                    </button>
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpop-purple/40 focus:border-kpop-purple focus:shadow-[0_0_12px_rgba(139,92,246,0.15)] transition-all text-sm"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredLessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedLessonId === lesson.id
                                ? 'bg-kpop-purple/5 border-kpop-purple shadow-sm'
                                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold text-sm ${selectedLessonId === lesson.id ? 'text-kpop-purple' : 'text-gray-800'}`}>
                                    {lesson.title}
                                </h4>
                                {lesson.is_published ? (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">
                                        LIVE
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-bold">
                                        DRAFT
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{lesson.artist}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className={`capitalize ${lesson.difficulty === 'beginner' ? 'text-green-600' :
                                    lesson.difficulty === 'intermediate' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                    {lesson.difficulty}
                                </span>
                            </div>
                        </div>
                    ))}

                    {filteredLessons.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">No lessons found</h3>
                            <p className="text-xs text-gray-500 mb-4 max-w-[200px]">
                                {searchTerm ? `No results for "${searchTerm}"` : "Get started by creating your first K-POP math lesson."}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={handleCreateNew}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Create Lesson
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Editor Form */}
            <div className="w-2/3 h-full overflow-y-auto bg-white rounded-xl shadow-kpop border border-gray-100 p-8">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="w-8 h-8 border-4 border-kpop-purple/30 border-t-kpop-purple rounded-full animate-spin mb-4"></div>
                        <p>Loading lesson data...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 pb-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedLessonId ? 'Edit Lesson' : 'Create New Lesson'}
                            </h2>
                            {selectedLessonId && (
                                <span className="text-xs font-mono text-gray-400">ID: {selectedLessonId}</span>
                            )}
                        </div>

                        {/* AI-generated question banner */}
                        {lastAIQuestion && (
                            <div className="mb-6 bg-kpop-purple/5 border border-kpop-purple/20 rounded-xl p-4 animate-fade-in">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-kpop-purple uppercase flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        AI-Generated Question Added
                                    </span>
                                    <button
                                        onClick={() => setLastAIQuestion(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-700">{lastAIQuestion.question}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Answer: <span className="font-medium text-green-700">{lastAIQuestion.correctAnswer}</span>
                                </p>
                            </div>
                        )}

                        {/* Key forces re-mount when selection changes to reset form state */}
                        <LessonForm
                            key={selectedLessonId || 'new'}
                            lessonId={selectedLessonId || undefined}
                            initialData={editorData ? {
                                title: editorData.title,
                                artist: editorData.artist,
                                math_concept: editorData.math_concept,
                                difficulty: editorData.difficulty,
                                tier_content: editorData.tier_content,
                                is_published: editorData.is_published
                            } : undefined}
                        />
                    </>
                )}
            </div>

            {/* AI Question Generator Modal */}
            <AIQuestionGeneratorModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onAddToLesson={async (question) => {
                    setIsAIModalOpen(false)

                    if (!selectedLessonId) {
                        // No lesson selected — just show the preview banner
                        setLastAIQuestion(question)
                        setToast({ type: 'success', message: 'Question generated! Select a lesson to save it.' })
                        setTimeout(() => setToast(null), 4000)
                        return
                    }

                    // PATCH the question into the selected lesson
                    setIsSavingAI(true)
                    try {
                        const res = await fetch(`/api/lessons/${selectedLessonId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ question }),
                        })
                        const data = await res.json()

                        if (!res.ok || !data.success) {
                            setToast({ type: 'error', message: data.error ?? 'Failed to add question' })
                        } else {
                            setLastAIQuestion(question)
                            setToast({ type: 'success', message: `Question added to lesson! (${data.data.questionsCount} total)` })
                        }
                    } catch (err) {
                        setToast({ type: 'error', message: err instanceof Error ? err.message : 'Network error' })
                    } finally {
                        setIsSavingAI(false)
                        setTimeout(() => setToast(null), 4000)
                    }
                }}
            />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] animate-fade-in">
                    <div
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-kpop border ${
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
        </div>
    )
}
