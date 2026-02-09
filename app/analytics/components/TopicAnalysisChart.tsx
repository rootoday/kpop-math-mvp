'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import type { TopicAnalysisData } from '@/types'

interface TopicAnalysisChartProps {
    data: TopicAnalysisData[]
}

const DIFFICULTY_COLORS: Record<string, string> = {
    beginner: '#10B981',
    intermediate: '#8B5CF6',
    advanced: '#E60031',
}

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload as TopicAnalysisData
    return (
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100 text-sm">
            <p className="font-bold text-gray-900">{d.mathConcept}</p>
            <p className="text-kpop-purple font-medium">{d.averageScore}% avg score</p>
            <p className="text-gray-500 text-xs">{d.attempts} total attempts</p>
            <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                    d.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800'
                        : d.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                }`}
            >
                {d.difficulty}
            </span>
        </div>
    )
}

export default function TopicAnalysisChart({ data }: TopicAnalysisChartProps) {
    if (data.length === 0) {
        return (
            <div className="card h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple rounded-t-xl" />
                <h3 className="text-lg font-bold text-gray-900 mb-4">Topic Analysis</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">Practice different topics to see your analysis!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kpop-purple via-kpop-red to-kpop-purple" />
            <h3 className="text-lg font-bold text-gray-900 mb-4">Topic Analysis</h3>

            <div className="flex gap-4 mb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-music-green inline-block" /> Beginner
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-kpop-purple inline-block" /> Intermediate
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-kpop-red inline-block" /> Advanced
                </span>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="shortLabel"
                        fontSize={11}
                        angle={-30}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v: number) => `${v}%`}
                        fontSize={12}
                        tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="averageScore" radius={[6, 6, 0, 0]} barSize={32}>
                        {data.map((entry, i) => (
                            <Cell
                                key={i}
                                fill={DIFFICULTY_COLORS[entry.difficulty] || '#8B5CF6'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
