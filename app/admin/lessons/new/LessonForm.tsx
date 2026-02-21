'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { createLesson, updateLesson } from '../actions'
import type { TierContent } from '@/types/database.types'
import { Tier1Editor, Tier2Editor, Tier3Editor, Tier4Editor, Tier5Editor } from './TierEditors'
import TierBlockEditor from '@/components/lessons/TierBlockEditor'
import { useUndoRedo } from '@/lib/hooks/useUndoRedo'
import { useAutoSave } from '@/lib/hooks/useAutoSave'

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

// Unified State for Undo/Redo
interface LessonState {
    title: string
    artist: string
    math_concept: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    tier_content: TierContent
    is_published: boolean
}

export default function LessonForm({ lessonId, initialData }: LessonFormProps) {
    // 1. Initialize Hook with Unified State
    const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<LessonState>({
        title: initialData?.title || '',
        artist: initialData?.artist || '',
        math_concept: initialData?.math_concept || '',
        difficulty: initialData?.difficulty || 'beginner',
        tier_content: initialData?.tier_content || defaultTierContent,
        is_published: initialData?.is_published || false
    })

    // 2. Setup Auto-Save
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSave = useCallback(async (data: LessonState) => {
        if (!lessonId) return // Don't auto-save new lessons until created

        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('artist', data.artist)
        formData.append('math_concept', data.math_concept)
        formData.append('difficulty', data.difficulty)
        formData.append('tier_content', JSON.stringify(data.tier_content))
        if (data.is_published) formData.append('is_published', 'true')

        return await updateLesson(lessonId, formData)
    }, [lessonId])

    const { status: saveStatus, lastSavedTime, error: saveError } = useAutoSave({
        data: state,
        onSave: handleSave,
        debounceMs: 2000
    })

    // 3. Unsaved Changes Warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveStatus === 'saving' || saveStatus === 'idle') { // simplistic check
                // In a real app we'd check if 'dirty', but 'idle' usually means dirty waiting to debounce
                // Here, let's just warn if we are saving or if changes happened
            }
        }
        // Simplified: React handles this poorly usually.
        // For now, let's skip browser native dialog which is obtrusive during dev.
    }, [saveStatus])

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault()
                if (e.shiftKey) {
                    if (canRedo) redo()
                } else {
                    if (canUndo) undo()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo, canUndo, canRedo])

    const updateField = (field: keyof LessonState, value: any) => {
        setState({ ...state, [field]: value })
    }

    const updateTier = (tierKey: keyof TierContent, data: any) => {
        setState({
            ...state,
            tier_content: {
                ...state.tier_content,
                [tierKey]: data
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`p-2 rounded hover:bg-white border border-transparent hover:border-gray-300 transition-all ${!canUndo ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
                        title="Undo (Ctrl+Z)"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={`p-2 rounded hover:bg-white border border-transparent hover:border-gray-300 transition-all ${!canRedo ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}`}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                        </svg>
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase">Save Status</span>
                        <div className="flex items-center gap-2 text-sm">
                            {saveStatus === 'saving' && (
                                <>
                                    <div className="w-3 h-3 rounded-full border-2 border-kpop-purple border-t-transparent animate-spin"></div>
                                    <span className="text-kpop-purple font-medium">Saving...</span>
                                </>
                            )}
                            {saveStatus === 'saved' && (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Saved at {lastSavedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                            {saveStatus === 'error' && (
                                <span className="text-red-500 font-medium">Save Failed</span>
                            )}
                            {saveStatus === 'idle' && !lastSavedTime && (
                                <span className="text-gray-400">Waiting for changes...</span>
                            )}
                        </div>
                    </div>
                </div>

                {!lessonId && (
                    <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded border border-yellow-200">
                        Auto-save disabled until Created
                    </div>
                )}
            </div>

            {error && (
                <div role="alert" className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex justify-between items-center animate-fade-in mb-6">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-red-700 font-medium text-sm">{error}</span>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        aria-label="Dismiss error"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Basic Lesson Info - Controlled Inputs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-1 h-6 bg-kpop-purple rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-800">Lesson Metadata</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
                        <input
                            value={state.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="input-field mt-1"
                            placeholder="e.g. Algebra with NewJeans"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Artist</label>
                        <input
                            value={state.artist}
                            onChange={(e) => updateField('artist', e.target.value)}
                            className="input-field mt-1"
                            placeholder="e.g. NewJeans"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Math Concept</label>
                        <input
                            value={state.math_concept}
                            onChange={(e) => updateField('math_concept', e.target.value)}
                            className="input-field mt-1"
                            placeholder="e.g. Combined Like Terms"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                        <select
                            value={state.difficulty}
                            onChange={(e) => updateField('difficulty', e.target.value)}
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
                                checked={state.is_published}
                                onChange={(e) => updateField('is_published', e.target.checked)}
                                className="w-5 h-5 text-kpop-purple rounded border-gray-300 focus:ring-kpop-purple"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Publish Lesson</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Interactive Tier Stack - Controlled Inputs */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-1 h-6 bg-music-green rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-800">Tier Structure</h3>
                </div>
                <TierBlockEditor
                    tierNumber={1}
                    data={state.tier_content.tier1}
                    onChange={(d) => updateTier('tier1', d)}
                    isDefaultOpen={true}
                >
                    <Tier1Editor data={state.tier_content.tier1} onChange={(d) => updateTier('tier1', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={2}
                    data={state.tier_content.tier2}
                    onChange={(d) => updateTier('tier2', d)}
                >
                    <Tier2Editor data={state.tier_content.tier2} onChange={(d) => updateTier('tier2', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={3}
                    data={state.tier_content.tier3}
                    onChange={(d) => updateTier('tier3', d)}
                >
                    <Tier3Editor data={state.tier_content.tier3} onChange={(d) => updateTier('tier3', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={4}
                    data={state.tier_content.tier4}
                    onChange={(d) => updateTier('tier4', d)}
                >
                    <Tier4Editor data={state.tier_content.tier4} onChange={(d) => updateTier('tier4', d)} />
                </TierBlockEditor>

                <TierBlockEditor
                    tierNumber={5}
                    data={state.tier_content.tier5}
                    onChange={(d) => updateTier('tier5', d)}
                >
                    <Tier5Editor data={state.tier_content.tier5} onChange={(d) => updateTier('tier5', d)} />
                </TierBlockEditor>
            </div>

            {/* Manual Save / Create Button */}
            <div className="flex justify-between items-center mt-8 sticky bottom-0 bg-white/90 backdrop-blur p-4 border-t z-10">
                <div className="text-sm text-gray-500">
                    {lessonId ? 'Changes serve as autosave drafts.' : 'Create lesson to enable auto-save.'}
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Back
                    </button>
                    {!lessonId && (
                        <button
                            onClick={async () => {
                                setError(null)
                                setIsSubmitting(true)
                                try {
                                    const formData = new FormData()
                                    formData.append('title', state.title)
                                    formData.append('artist', state.artist)
                                    formData.append('math_concept', state.math_concept)
                                    formData.append('difficulty', state.difficulty)
                                    formData.append('tier_content', JSON.stringify(state.tier_content))
                                    if (state.is_published) formData.append('is_published', 'true')
                                    const result = await createLesson(formData)
                                    if (result?.error) {
                                        setError(result.error)
                                        setIsSubmitting(false)
                                    }
                                } catch (e) {
                                    setError('An unexpected error occurred. Please try again.')
                                    setIsSubmitting(false)
                                }
                            }}
                            disabled={isSubmitting}
                            className="btn-primary min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Lesson'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
