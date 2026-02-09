'use client'

import { motion } from 'framer-motion'

interface ProgressBarAnimatedProps {
    value: number // 0-100
    color?: string
    height?: string
    className?: string
}

export default function ProgressBarAnimated({
    value,
    color = 'bg-kpop-purple',
    height = 'h-2',
    className = '',
}: ProgressBarAnimatedProps) {
    return (
        <div className={`w-full bg-gray-200 rounded-full ${height} ${className}`}>
            <motion.div
                className={`${color} ${height} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />
        </div>
    )
}
