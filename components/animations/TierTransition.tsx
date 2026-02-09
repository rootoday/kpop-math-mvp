'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TierTransitionProps {
    tierKey: number
    children: React.ReactNode
    direction?: 'forward' | 'backward'
}

export default function TierTransition({
    tierKey,
    children,
    direction = 'forward',
}: TierTransitionProps) {
    const xOffset = direction === 'forward' ? 60 : -60

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={tierKey}
                initial={{ opacity: 0, x: xOffset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -xOffset }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
