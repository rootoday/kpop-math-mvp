'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
    width?: string
    height?: string
    rounded?: string
    className?: string
}

export default function SkeletonLoader({
    width = '100%',
    height = '1rem',
    rounded = 'rounded-md',
    className = '',
}: SkeletonLoaderProps) {
    return (
        <motion.div
            className={`bg-gray-200 ${rounded} ${className}`}
            style={{ width, height }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="card space-y-3">
            <SkeletonLoader height="0.75rem" width="30%" />
            <SkeletonLoader height="1.5rem" width="80%" />
            <SkeletonLoader height="0.875rem" width="50%" />
            <div className="pt-2">
                <SkeletonLoader height="2.5rem" rounded="rounded-lg" />
            </div>
        </div>
    )
}
