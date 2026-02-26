import { useState, useCallback, useRef } from 'react'
import type {
    VideoScript,
    GenerateFullLessonResponse,
    FullLessonGenerated,
    ScriptAnalysis,
    LessonMetadata,
} from '@/types/ai'

interface UseFullLessonGeneratorState {
    loading: boolean
    error: string | null
    analysis: ScriptAnalysis | null
    lesson: FullLessonGenerated | null
    metadata: LessonMetadata | null
    isSuccess: boolean
}

interface UseFullLessonGeneratorReturn extends UseFullLessonGeneratorState {
    generateFullLesson: (params: {
        script: VideoScript
        difficulty?: number
        artistOverride?: string
    }) => Promise<void>
    reset: () => void
}

const INITIAL_STATE: UseFullLessonGeneratorState = {
    loading: false,
    error: null,
    analysis: null,
    lesson: null,
    metadata: null,
    isSuccess: false,
}

export function useFullLessonGenerator(): UseFullLessonGeneratorReturn {
    const [state, setState] = useState<UseFullLessonGeneratorState>(INITIAL_STATE)
    const abortRef = useRef<AbortController | null>(null)

    const generateFullLesson = useCallback(
        async (params: {
            script: VideoScript
            difficulty?: number
            artistOverride?: string
        }): Promise<void> => {
            abortRef.current?.abort()
            const controller = new AbortController()
            abortRef.current = controller

            setState({ loading: true, error: null, analysis: null, lesson: null, metadata: null, isSuccess: false })

            try {
                const res = await fetch('/api/ai/generate-full-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params),
                    signal: controller.signal,
                })

                if (!res.ok) {
                    const body: GenerateFullLessonResponse = await res.json().catch(() => ({
                        success: false,
                        error: `Server error (${res.status})`,
                    }))
                    const message = body.error ?? `Request failed with status ${res.status}`
                    setState({ loading: false, error: message, analysis: null, lesson: null, metadata: null, isSuccess: false })
                    return
                }

                const body: GenerateFullLessonResponse = await res.json()

                if (!body.success || !body.data) {
                    const message = body.error ?? 'Failed to generate full lesson'
                    setState({ loading: false, error: message, analysis: null, lesson: null, metadata: null, isSuccess: false })
                    return
                }

                setState({
                    loading: false,
                    error: null,
                    analysis: body.data.analysis,
                    lesson: body.data.lesson,
                    metadata: body.data.metadata,
                    isSuccess: true,
                })
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    return
                }

                const message =
                    err instanceof Error ? err.message : 'An unexpected error occurred'
                setState({ loading: false, error: message, analysis: null, lesson: null, metadata: null, isSuccess: false })
            }
        },
        [],
    )

    const reset = useCallback(() => {
        abortRef.current?.abort()
        abortRef.current = null
        setState(INITIAL_STATE)
    }, [])

    return {
        ...state,
        generateFullLesson,
        reset,
    }
}
