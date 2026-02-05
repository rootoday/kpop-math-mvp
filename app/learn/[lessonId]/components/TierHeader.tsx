'use client'

import type { TierLevel } from '@/types'

interface TierHeaderProps {
    tier: TierLevel
    title: string
    shortDescription: string
    learningObjective: string
    estimatedMinutes: number
}

const tierLabels: Record<number, string> = {
    1: 'Introduction',
    2: 'Concept',
    3: 'Practice',
    4: 'Challenge',
    5: 'Celebration',
}

export default function TierHeader({
    tier,
    title,
    shortDescription,
    learningObjective,
    estimatedMinutes,
}: TierHeaderProps) {
    return (
        <div className="border-l-4 border-kpop-purple bg-gradient-to-r from-purple-50 to-white
                        rounded-r-lg p-5 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-beginner text-xs">
                    {tierLabels[tier] || `Tier ${tier}`}
                </span>
                <span className="text-xs text-gray-400">
                    Tier {tier} of 5
                </span>
            </div>

            <h2 className="text-2xl font-bold text-text-dark mb-1">{title}</h2>
            <p className="text-gray-600 mb-3">{shortDescription}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                    <span>🎯</span>
                    <span>{learningObjective}</span>
                </span>
                <span className="flex items-center gap-1">
                    <span>⏱</span>
                    <span>{estimatedMinutes} min</span>
                </span>
            </div>
        </div>
    )
}
