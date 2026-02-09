'use client'

import { motion } from 'framer-motion'
import AnimatedBadge from './AnimatedBadge'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'

interface CelebrationOverlayProps {
    congratsText: string
    summaryText: string
    xpBreakdown: Array<{ label: string; value: number; color?: string }>
    totalXp: number
    badgeEarned?: string | null
    actions: React.ReactNode
}

export default function CelebrationOverlay({
    congratsText,
    summaryText,
    xpBreakdown,
    totalXp,
    badgeEarned,
    actions,
}: CelebrationOverlayProps) {
    return (
        <div className="card text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                className="text-7xl mb-4"
            >
                🎉
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold mb-3 text-gradient"
            >
                {congratsText}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-8"
            >
                {summaryText}
            </motion.p>

            {/* XP Summary */}
            <StaggerContainer
                staggerDelay={0.15}
                className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto"
            >
                {xpBreakdown.map(item => (
                    <motion.div
                        key={item.label}
                        variants={staggerItemVariants}
                        className={`p-4 ${item.color || 'bg-purple-50'} rounded-lg`}
                    >
                        <div className="text-2xl font-bold text-kpop-purple">+{item.value}</div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                    </motion.div>
                ))}
            </StaggerContainer>

            {/* Total XP + Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 20 }}
                className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-6"
            >
                <div className="text-3xl font-bold text-gradient">Total: {totalXp} XP</div>
                {badgeEarned && (
                    <AnimatedBadge className="mt-2">
                        <span className="text-sm text-gray-600">
                            🏆 Badge earned: {badgeEarned}
                        </span>
                    </AnimatedBadge>
                )}
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">{actions}</div>
        </div>
    )
}
