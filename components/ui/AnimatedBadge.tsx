'use client'

import { motion } from 'framer-motion'

interface AnimatedBadgeProps {
    children: React.ReactNode
    className?: string
}

export default function AnimatedBadge({ children, className = '' }: AnimatedBadgeProps) {
    return (
        <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className={`inline-flex items-center ${className}`}
        >
            {children}
        </motion.span>
    )
}
