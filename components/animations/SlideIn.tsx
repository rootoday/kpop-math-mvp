'use client'

import { motion } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right'

interface SlideInProps {
    children: React.ReactNode
    direction?: Direction
    delay?: number
    duration?: number
    distance?: number
    className?: string
}

function getOffset(direction: Direction, distance: number) {
    switch (direction) {
        case 'up':    return { x: 0, y: distance }
        case 'down':  return { x: 0, y: -distance }
        case 'left':  return { x: distance, y: 0 }
        case 'right': return { x: -distance, y: 0 }
    }
}

export default function SlideIn({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.5,
    distance = 20,
    className = '',
}: SlideInProps) {
    const offset = getOffset(direction, distance)

    return (
        <motion.div
            initial={{ opacity: 0, ...offset }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
