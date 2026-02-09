'use client'

import { motion } from 'framer-motion'

interface SpinnerProps {
    size?: number
    className?: string
}

export default function Spinner({ size = 32, className = '' }: SpinnerProps) {
    return (
        <motion.div
            className={`border-3 border-kpop-purple/30 border-t-kpop-purple rounded-full ${className}`}
            style={{ width: size, height: size }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
    )
}
