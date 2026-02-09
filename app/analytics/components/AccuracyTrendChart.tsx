'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts'
import type { AccuracyTrendPoint } from '@/types'

interface AccuracyTrendChartProps {
    data: AccuracyTrendPoint[]
}

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload as AccuracyTrendPoint
    return (
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100 text-sm">
            <p className="font-bold text-gray-900">{d.dateLabel}</p>
            <p className="text-kpop-purple font-medium">{d.accuracy}% accuracy</p>
            <p className="text-gray-500 text-xs">
                {d.sessionCount} session{d.sessionCount !== 1 ? 's' : ''}
            </p>
        </div>
    )
}

export default function AccuracyTrendChart({ data }: AccuracyTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="card h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple rounded-t-xl" />
                <h3 className="text-lg font-bold text-gray-900 mb-4">Accuracy Trend (30 Days)</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p className="text-gray-500">Complete some lessons to see your accuracy trend!</p>
                </div>
            </div>
        )
    }

    // Show every Nth label to avoid crowding
    const interval = Math.max(1, Math.floor(data.length / 6))

    return (
        <div className="card relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple" />
            <h3 className="text-lg font-bold text-gray-900 mb-4">Accuracy Trend (30 Days)</h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="dateLabel"
                        fontSize={12}
                        interval={interval - 1}
                        tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v: number) => `${v}%`}
                        fontSize={12}
                        tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                        y={70}
                        stroke="#E60031"
                        strokeDasharray="3 3"
                        label={{ value: 'Target', position: 'right', fill: '#E60031', fontSize: 11 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#8B5CF6"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
                        connectNulls={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
