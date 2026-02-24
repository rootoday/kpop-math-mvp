import { useState, useCallback, useRef } from 'react'
import type {
  VideoScript,
  GenerateFromScriptResponse,
  ScriptGeneratedQuestion,
  ScriptAnalysis,
} from '@/types/ai'

interface UseScriptQuestionGeneratorState {
  loading: boolean
  error: string | null
  analysis: ScriptAnalysis | null
  questions: ScriptGeneratedQuestion[]
  isSuccess: boolean
}

interface UseScriptQuestionGeneratorReturn extends UseScriptQuestionGeneratorState {
  generateFromScript: (params: {
    script: VideoScript
    questionCount?: number
    difficulty?: number
  }) => Promise<void>
  reset: () => void
}

const INITIAL_STATE: UseScriptQuestionGeneratorState = {
  loading: false,
  error: null,
  analysis: null,
  questions: [],
  isSuccess: false,
}

export function useScriptQuestionGenerator(): UseScriptQuestionGeneratorReturn {
  const [state, setState] = useState<UseScriptQuestionGeneratorState>(INITIAL_STATE)
  const abortRef = useRef<AbortController | null>(null)

  const generateFromScript = useCallback(
    async (params: {
      script: VideoScript
      questionCount?: number
      difficulty?: number
    }): Promise<void> => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState({ loading: true, error: null, analysis: null, questions: [], isSuccess: false })

      try {
        const res = await fetch('/api/ai/generate-from-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal,
        })

        if (!res.ok) {
          const body: GenerateFromScriptResponse = await res.json().catch(() => ({
            success: false,
            error: `Server error (${res.status})`,
          }))
          const message = body.error ?? `Request failed with status ${res.status}`
          setState({ loading: false, error: message, analysis: null, questions: [], isSuccess: false })
          return
        }

        const body: GenerateFromScriptResponse = await res.json()

        if (!body.success || !body.data) {
          const message = body.error ?? 'Failed to generate questions from script'
          setState({ loading: false, error: message, analysis: null, questions: [], isSuccess: false })
          return
        }

        setState({
          loading: false,
          error: null,
          analysis: body.data.analysis,
          questions: body.data.questions,
          isSuccess: true,
        })
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        setState({ loading: false, error: message, analysis: null, questions: [], isSuccess: false })
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
    generateFromScript,
    reset,
  }
}
