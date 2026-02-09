'use client'

import { motion } from 'framer-motion'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'

interface StatCardsProps {
    completedCount: number
    totalCount: number
    accuracyRate: number
    totalStudyTime: string
    currentStreak: number
}

export default function StatCards({
    completedCount,
    totalCount,
    accuracyRate,
    totalStudyTime,
    currentStreak,
}: StatCardsProps) {
    const cards = [
        {
            label: 'Completed Lessons',
            value: `${completedCount}/${totalCount}`,
            color: 'text-kpop-purple',
            bgColor: 'bg-kpop-purple/10',
            icon: (
                <svg className="w-6 h-6 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Accuracy Rate',
            value: `${accuracyRate}%`,
            color: 'text-music-green',
            bgColor: 'bg-music-green/10',
            icon: (
                <svg className="w-6 h-6 text-music-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            label: 'Study Time',
            value: totalStudyTime,
            color: 'text-kpop-purple',
            bgColor: 'bg-kpop-purple/10',
            icon: (
                <svg className="w-6 h-6 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Day Streak',
            value: `${currentStreak}`,
            color: 'text-kpop-red',
            bgColor: 'bg-kpop-red/10',
            icon: (
                <svg className="w-6 h-6 text-kpop-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
            ),
        },
    ]

    return (
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
                <motion.div
                    key={card.label}
                    variants={staggerItemVariants}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="card"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                            {card.icon}
                        </div>
                    </div>
                    <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                    <div className="text-gray-500 text-sm mt-1">{card.label}</div>
                </motion.div>
            ))}
        </StaggerContainer>
    )
}
