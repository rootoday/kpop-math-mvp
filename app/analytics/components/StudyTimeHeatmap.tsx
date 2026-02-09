'use client'

import type { HeatmapCell } from '@/types'
import { TIME_BLOCKS, DAY_LABELS, getHeatmapColor } from '@/lib/analytics/metrics'

interface StudyTimeHeatmapProps {
    data: HeatmapCell[]
}

export default function StudyTimeHeatmap({ data }: StudyTimeHeatmapProps) {
    const hasData = data.some(cell => cell.totalMinutes > 0)

    if (!hasData) {
        return (
            <div className="card h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple rounded-t-xl" />
                <h3 className="text-lg font-bold text-gray-900 mb-4">Study Activity</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No study sessions recorded yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Start a lesson to see your activity patterns!</p>
                </div>
            </div>
        )
    }

    // Build 2D grid: rows=days(0-6), cols=timeBlocks(0-5)
    const grid: HeatmapCell[][] = DAY_LABELS.map((_, dayIdx) =>
        TIME_BLOCKS.map((_, blockIdx) =>
            data.find(c => c.dayOfWeek === dayIdx && c.timeBlock === blockIdx)
            || { dayOfWeek: dayIdx, timeBlock: blockIdx, totalMinutes: 0, sessionCount: 0, intensity: 0 }
        )
    )

    return (
        <div className="card h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple rounded-t-xl" />
            <h3 className="text-lg font-bold text-gray-900 mb-4">Study Activity</h3>

            <div className="grid grid-cols-[auto_repeat(6,1fr)] gap-1 md:gap-2">
                {/* Header row: empty corner + 6 time block labels */}
                <div />
                {TIME_BLOCKS.map((block, i) => (
                    <div key={i} className="text-[10px] md:text-xs text-gray-400 text-center leading-tight whitespace-pre-line">
                        {block.label}
                    </div>
                ))}

                {/* Data rows: day label + 6 cells */}
                {grid.map((row, dayIdx) => (
                    <div key={dayIdx} className="contents">
                        <div className="text-xs text-gray-500 font-medium flex items-center pr-1">
                            {DAY_LABELS[dayIdx]}
                        </div>
                        {row.map((cell, blockIdx) => (
                            <div key={`${dayIdx}-${blockIdx}`} className="relative group">
                                <div
                                    className="w-full aspect-square rounded-md transition-transform hover:scale-110 cursor-default"
                                    style={{ backgroundColor: getHeatmapColor(cell.intensity) }}
                                />
                                {cell.totalMinutes > 0 && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                                        {Math.round(cell.totalMinutes)}min &middot; {cell.sessionCount} session{cell.sessionCount !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-4 text-xs text-gray-400">
                <span>Less</span>
                {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
                    <div
                        key={intensity}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getHeatmapColor(intensity) }}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    )
}
