'use client'

import Link from 'next/link'
import { useState } from 'react'
import { deleteLesson } from './actions'

interface LessonActionsProps {
    lessonId: string
    lessonTitle: string
}

export default function LessonActions({ lessonId, lessonTitle }: LessonActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmCount, setConfirmCount] = useState(0)

    const handleDelete = async () => {
        if (confirmCount < 1) {
            setConfirmCount(1)
            return
        }

        setIsDeleting(true)
        const result = await deleteLesson(lessonId)

        if (result.success) {
            // Revalidation is handled in the server action
            setConfirmCount(0)
            setIsDeleting(false)
        } else {
            alert('Failed to delete lesson: ' + result.error)
            setIsDeleting(false)
            setConfirmCount(0)
        }
    }

    const resetDelete = () => {
        setConfirmCount(0)
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href={`/admin/lessons/${lessonId}/edit`}
                className="text-kpop-purple hover:underline font-medium"
            >
                Edit
            </Link>

            <div className="relative">
                {confirmCount === 0 ? (
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:underline font-medium"
                    >
                        Delete
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in zoom-in duration-200">
                        <span className="text-xs text-red-700 font-bold whitespace-nowrap">Really delete?</span>
                        <button
                            disabled={isDeleting}
                            onClick={handleDelete}
                            className="bg-red-500 text-white text-[10px] px-2 py-1 rounded hover:bg-red-600 transition-colors uppercase font-black"
                        >
                            {isDeleting ? '...' : 'YES'}
                        </button>
                        <button
                            onClick={resetDelete}
                            className="text-gray-400 hover:text-gray-600 text-[10px] uppercase font-bold"
                        >
                            No
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
