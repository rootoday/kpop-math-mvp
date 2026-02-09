'use client'

import type { TierLevel } from '@/types'

interface ProgressBarProps {
    currentTier: TierLevel
    completedTiers: Set<number>
    onTierClick: (tier: TierLevel) => void
    titles: string[]
}

export default function ProgressBar({ currentTier, completedTiers, onTierClick, titles }: ProgressBarProps) {
    const tiers: TierLevel[] = [1, 2, 3, 4, 5]

    const maxUnlocked = (): number => {
        let max = 1
        for (const t of tiers) {
            if (completedTiers.has(t)) {
                max = Math.max(max, t + 1)
            }
        }
        return Math.min(max, 5)
    }

    const canNavigate = (tier: TierLevel): boolean => {
        return tier === 1 || completedTiers.has(tier) || tier <= maxUnlocked()
    }

    const getStepStyle = (tier: TierLevel) => {
        if (completedTiers.has(tier)) {
            return 'bg-music-green text-white cursor-pointer hover:scale-110 shadow-sm'
        }
        if (tier === currentTier) {
            return 'bg-kpop-purple text-white cursor-pointer shadow-neon'
        }
        if (canNavigate(tier)) {
            return 'bg-purple-200 text-kpop-purple cursor-pointer hover:bg-purple-300'
        }
        return 'bg-gray-200 text-gray-400 cursor-not-allowed'
    }

    const getLineStyle = (tier: TierLevel) => {
        if (completedTiers.has(tier)) {
            return 'gradient-primary'
        }
        return 'bg-gray-200'
    }

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                {tiers.map((tier, i) => (
                    <div key={tier} className="flex items-center flex-1 last:flex-none">
                        {/* Step circle */}
                        <button
                            onClick={() => canNavigate(tier) && onTierClick(tier)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center
                                font-bold text-sm transition-all duration-200 flex-shrink-0
                                ${getStepStyle(tier)}`}
                            title={titles[i] || `Tier ${tier}`}
                            disabled={!canNavigate(tier)}
                        >
                            {completedTiers.has(tier) ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                tier
                            )}
                        </button>

                        {/* Connector line */}
                        {i < 4 && (
                            <div className={`h-1 flex-1 mx-1 rounded-full transition-colors duration-300 ${getLineStyle(tier)}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Current tier label */}
            <p className="text-center text-sm text-gray-500 mt-2">
                {completedTiers.size}/5 complete
            </p>
        </div>
    )
}
