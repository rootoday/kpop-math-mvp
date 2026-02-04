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
    const valRef = useRef(data)
    const saveRef = useRef(onSave)
    const firstRun = useRef(true)

    useEffect(() => {
        valRef.current = data
    }, [data])

    useEffect(() => {
        saveRef.current = onSave
    }, [onSave])

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false
            return
        }

        // Don't save on initial mount unless data changes later
        // But here we just assume any change to data triggers this effect
        // If data is stable on mount, this won't trigger if we put it in dependency

        // However, we want to skip the very first run if we want to avoid saving initial state immediately?
        // Usually, inputs change -> data changes -> effect triggers.
        // Let's rely on standard debounce pattern.

        setStatus('saving')

        const handler = setTimeout(async () => {
            try {
                const result = await saveRef.current(valRef.current)
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
