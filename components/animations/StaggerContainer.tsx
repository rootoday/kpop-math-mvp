'use client'

import { motion, type Variants } from 'framer-motion'

interface StaggerContainerProps {
    children: React.ReactNode
    staggerDelay?: number
    className?: string
}

const containerVariants = (staggerDelay: number): Variants => ({
    hidden: {},
    show: {
        transition: {
            staggerChildren: staggerDelay,
        },
    },
})

export const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
}

export default function StaggerContainer({
    children,
    staggerDelay = 0.1,
    className = '',
}: StaggerContainerProps) {
    return (
        <motion.div
            variants={containerVariants(staggerDelay)}
            initial="hidden"
            animate="show"
            className={className}
        >
            {children}
        </motion.div>
    )
}
