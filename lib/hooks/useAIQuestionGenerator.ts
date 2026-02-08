import { useState, useCallback, useRef } from 'react'
import type {
  AIQuestion,
  GenerateQuestionRequest,
  GenerateQuestionResponse,
} from '@/types/ai'

interface UseAIQuestionGeneratorState {
  loading: boolean
  error: string | null
  data: AIQuestion | null
  isSuccess: boolean
}

interface UseAIQuestionGeneratorReturn extends UseAIQuestionGeneratorState {
  generateQuestion: (params: GenerateQuestionRequest) => Promise<AIQuestion | null>
  reset: () => void
}

const INITIAL_STATE: UseAIQuestionGeneratorState = {
  loading: false,
  error: null,
  data: null,
  isSuccess: false,
}

export function useAIQuestionGenerator(): UseAIQuestionGeneratorReturn {
  const [state, setState] = useState<UseAIQuestionGeneratorState>(INITIAL_STATE)
  const abortRef = useRef<AbortController | null>(null)

  const generateQuestion = useCallback(
    async (params: GenerateQuestionRequest): Promise<AIQuestion | null> => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState({ loading: true, error: null, data: null, isSuccess: false })

      try {
        const res = await fetch('/api/ai/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal,
        })

        if (!res.ok) {
          const body: GenerateQuestionResponse = await res.json().catch(() => ({
            success: false,
            error: `Server error (${res.status})`,
          }))
          const message = body.error ?? `Request failed with status ${res.status}`
          setState({ loading: false, error: message, data: null, isSuccess: false })
          return null
        }

        const body: GenerateQuestionResponse = await res.json()

        if (!body.success || !body.data) {
          const message = body.error ?? 'Failed to generate question'
          setState({ loading: false, error: message, data: null, isSuccess: false })
          return null
        }

        setState({ loading: false, error: null, data: body.data, isSuccess: true })
        return body.data
      } catch (err: unknown) {
        // Don't update state if the request was intentionally aborted
        if (err instanceof DOMException && err.name === 'AbortError') {
          return null
        }

        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred'
        setState({ loading: false, error: message, data: null, isSuccess: false })
        return null
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
    generateQuestion,
    reset,
  }
}
