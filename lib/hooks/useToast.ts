'use client'

import { useState, useCallback, useRef } from 'react'

export interface ToastData {
    id: string
    type: 'success' | 'error' | 'info'
    message: string
}

export function useToast(autoDismissMs = 4000) {
    const [toasts, setToasts] = useState<ToastData[]>([])
    const counterRef = useRef(0)

    const showToast = useCallback(
        (type: ToastData['type'], message: string) => {
            const id = `toast-${++counterRef.current}`
            setToasts(prev => [...prev, { id, type, message }])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, autoDismissMs)
        },
        [autoDismissMs]
    )

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return { toasts, showToast, dismissToast }
}
