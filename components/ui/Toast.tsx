'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ToastData } from '@/lib/hooks/useToast'

interface ToastContainerProps {
    toasts: ToastData[]
    onDismiss: (id: string) => void
}

const typeStyles: Record<ToastData['type'], string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const typeIcons: Record<ToastData['type'], string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-[60] space-y-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${typeStyles[toast.type]}`}
                    >
                        <span>{typeIcons[toast.type]}</span>
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => onDismiss(toast.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
