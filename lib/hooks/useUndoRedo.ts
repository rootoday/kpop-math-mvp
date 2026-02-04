import { useState, useCallback } from 'react'

interface UndoRedoResult<T> {
    state: T
    setState: (newState: T) => void
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
    history: T[]
}

export function useUndoRedo<T>(initialState: T, maxHistory: number = 20): UndoRedoResult<T> {
    const [history, setHistory] = useState<T[]>([initialState])
    const [index, setIndex] = useState(0)

    const state = history[index]

    const setState = useCallback((newState: T) => {
        setHistory((prev) => {
            const newHistory = prev.slice(0, index + 1)
            newHistory.push(newState)

            // Limit history length
            if (newHistory.length > maxHistory) {
                newHistory.shift()
                setIndex(maxHistory - 1) // maintain pointer at end
                return newHistory
            }

            setIndex(newHistory.length - 1)
            return newHistory
        })
    }, [index, maxHistory])

    const undo = useCallback(() => {
        setIndex((prev) => Math.max(0, prev - 1))
    }, [])

    const redo = useCallback(() => {
        setIndex((prev) => Math.min(history.length - 1, prev + 1))
    }, [history.length])

    return {
        state,
        setState,
        undo,
        redo,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
        history
    }
}
