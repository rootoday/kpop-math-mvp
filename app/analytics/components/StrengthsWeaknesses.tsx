'use client'

import type { TopicInsight } from '@/types'

interface StrengthsWeaknessesProps {
    strengths: TopicInsight[]
    weaknesses: TopicInsight[]
}

function TrendBadge({ trend }: { trend: TopicInsight['trend'] }) {
    if (trend === 'improving') {
        return (
            <span className="inline-flex items-center gap-0.5 text-xs text-music-green font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Improving
            </span>
        )
    }
    if (trend === 'declining') {
        return (
            <span className="inline-flex items-center gap-0.5 text-xs text-kpop-red font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Declining
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-0.5 text-xs text-gray-400 font-medium">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
            Stable
        </span>
    )
}

function TopicItem({
    insight,
    isStrength,
}: {
    insight: TopicInsight
    isStrength: boolean
}) {
    const bgColor = isStrength ? 'bg-green-50/70' : 'bg-red-50/70'
    const scoreBg = isStrength ? 'bg-music-green/20' : 'bg-kpop-red/20'
    const scoreText = isStrength ? 'text-music-green' : 'text-kpop-red'

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg ${bgColor} mb-2 last:mb-0`}>
            <div className={`w-10 h-10 rounded-lg ${scoreBg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-sm font-bold ${scoreText}`}>{insight.averageScore}%</span>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{insight.mathConcept}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{insight.suggestion}</p>
                <div className="mt-1">
                    <TrendBadge trend={insight.trend} />
                </div>
            </div>
        </div>
    )
}

export default function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
    if (strengths.length === 0 && weaknesses.length === 0) {
        return (
            <div className="card h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Strengths & Weaknesses</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Complete a few lessons to discover</p>
                    <p className="text-gray-400 text-xs mt-1">your strengths and areas for improvement!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card h-full max-h-[420px] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Strengths & Weaknesses</h3>

            {/* Strengths */}
            {strengths.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-music-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Top Strengths</span>
                    </div>
                    {strengths.map((s, i) => (
                        <TopicItem key={i} insight={s} isStrength={true} />
                    ))}
                </div>
            )}

            {/* Weaknesses */}
            {weaknesses.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-kpop-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Needs Improvement</span>
                    </div>
                    {weaknesses.map((w, i) => (
                        <TopicItem key={i} insight={w} isStrength={false} />
                    ))}
                </div>
            )}
        </div>
    )
}
