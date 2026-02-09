'use client'

import type { RecentActivityItem } from '@/types'
import { formatRelativeTime } from '@/lib/dashboard/stats'

interface RecentActivityProps {
    items: RecentActivityItem[]
    onLessonClick: (lessonId: string) => void
}

const ACTION_CONFIG = {
    completed: {
        dotColor: 'bg-music-green',
        dotRing: 'ring-music-green/20',
        label: 'Completed',
        textColor: 'text-music-green',
    },
    continued: {
        dotColor: 'bg-kpop-purple',
        dotRing: 'ring-kpop-purple/20',
        label: 'Continued',
        textColor: 'text-kpop-purple',
    },
    started: {
        dotColor: 'bg-gray-400',
        dotRing: 'ring-gray-200',
        label: 'Started',
        textColor: 'text-gray-500',
    },
}

export default function RecentActivity({ items, onLessonClick }: RecentActivityProps) {
    if (items.length === 0) {
        return (
            <div className="card h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No activity yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Start your first lesson!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-0 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item, i) => {
                    const config = ACTION_CONFIG[item.action]
                    return (
                        <div
                            key={`${item.lessonId}-${i}`}
                            className="relative pl-6 pb-5 last:pb-0 cursor-pointer group"
                            onClick={() => onLessonClick(item.lessonId)}
                        >
                            {/* Timeline line */}
                            {i < items.length - 1 && (
                                <div className="absolute left-[7px] top-3 bottom-0 w-px bg-gray-200" />
                            )}
                            {/* Timeline dot */}
                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${config.dotColor} ring-4 ${config.dotRing}`} />

                            <div className="group-hover:bg-purple-50/40 rounded-lg p-1.5 -m-1.5 transition-all duration-200">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-xs font-medium ${config.textColor}`}>
                                        {config.label}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatRelativeTime(item.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.lessonTitle}
                                </p>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-gray-500">{item.artist}</span>
                                    {item.score > 0 && (
                                        <span className="text-xs text-gray-400">
                                            Score: {item.score}
                                        </span>
                                    )}
                                    {item.xpEarned > 0 && (
                                        <span className="text-xs text-kpop-purple font-medium">
                                            +{item.xpEarned} XP
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
