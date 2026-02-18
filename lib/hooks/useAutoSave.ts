import { useState, useEffect, useRef } from 'react'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
    data: T
    onSave: (data: T) => Promise<{ error?: string } | void>
    debounceMs?: number
}

export function useAutoSave<T>({ data, onSave, debounceMs = 2000 }: UseAutoSaveOptions<T>) {
    const [status, setStatus] = useState<SaveStatus>('idle')
    const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Refs
    const saveRef = useRef(onSave)
    const prevDataRef = useRef(data)

    useEffect(() => {
        saveRef.current = onSave
    }, [onSave])

    useEffect(() => {
        // Skip if data reference hasn't changed (handles initial mount and strict mode re-mount)
        if (prevDataRef.current === data) {
            return
        }
        prevDataRef.current = data

        setStatus('saving')

        const handler = setTimeout(async () => {
            try {
                const result = await saveRef.current(data)
                if (result && typeof result === 'object' && 'error' in result && result.error) {
                    throw new Error(result.error)
                }
                setStatus('saved')
                setLastSavedTime(new Date())
                setError(null)
            } catch (err: any) {
                setStatus('error')
                setError(err.message || 'Auto-save failed')
            }
        }, debounceMs)

        return () => {
            clearTimeout(handler)
        }
    }, [data, debounceMs])

    return { status, lastSavedTime, error }
}
