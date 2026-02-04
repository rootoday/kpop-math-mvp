'use client'

import { useState } from 'react'
import { getLesson } from './actions'
import LessonForm from './new/LessonForm'
import type { Database } from '@/types/database.types'

type Lesson = Database['public']['Tables']['lessons']['Row']

interface LessonManagerProps {
    initialLessons: Lesson[]
}

export default function LessonManager({ initialLessons }: LessonManagerProps) {
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
    const [editorData, setEditorData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

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
            <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                    <button
                        onClick={handleCreateNew}
                        className="w-full btn-primary mb-4"
                    >
                        + Create New Lesson
                    </button>
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpop-purple/20 transition-all text-sm"
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
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No lessons found.
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Editor Form */}
            <div className="w-2/3 h-full overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
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
        </div>
    )
}
