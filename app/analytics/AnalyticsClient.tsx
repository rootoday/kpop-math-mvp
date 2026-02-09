'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Lesson, UserProgress, User } from '@/types'
import { calculateAccuracyRate, calculateTotalStudyTime, formatStudyTime } from '@/lib/dashboard/stats'
import {
    computeAccuracyTrend,
    computeTopicAnalysis,
    computeStudyHeatmap,
    computeTopicInsights,
    getMostActiveDay,
} from '@/lib/analytics/metrics'
import AnalyticsStatCards from './components/AnalyticsStatCards'
import StudyTimeHeatmap from './components/StudyTimeHeatmap'
import StrengthsWeaknesses from './components/StrengthsWeaknesses'

const AccuracyTrendChart = dynamic(() => import('./components/AccuracyTrendChart'), {
    loading: () => (
        <div className="card h-[380px] flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-kpop-purple/30 border-t-kpop-purple rounded-full animate-spin" />
        </div>
    ),
    ssr: false,
})

const TopicAnalysisChart = dynamic(() => import('./components/TopicAnalysisChart'), {
    loading: () => (
        <div className="card h-[380px] flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-kpop-purple/30 border-t-kpop-purple rounded-full animate-spin" />
        </div>
    ),
    ssr: false,
})

interface AnalyticsClientProps {
    lessons: Lesson[]
    progress: UserProgress[]
    user: User
}

export default function AnalyticsClient({ lessons, progress, user }: AnalyticsClientProps) {
    // --- Computed analytics data ---
    const accuracyTrend = useMemo(
        () => computeAccuracyTrend(progress),
        [progress]
    )

    const topicAnalysis = useMemo(
        () => computeTopicAnalysis(progress, lessons),
        [progress, lessons]
    )

    const heatmapData = useMemo(
        () => computeStudyHeatmap(progress),
        [progress]
    )

    const insights = useMemo(
        () => computeTopicInsights(progress, lessons),
        [progress, lessons]
    )

    // Stat card data
    const topicsStudied = useMemo(() => {
        const lessonMap = new Map(lessons.map(l => [l.id, l]))
        const concepts = new Set<string>()
        for (const p of progress) {
            if (p.attempts > 0) {
                const lesson = lessonMap.get(p.lesson_id)
                if (lesson) concepts.add(lesson.math_concept)
            }
        }
        return concepts.size
    }, [progress, lessons])

    const averageAccuracy = useMemo(
        () => calculateAccuracyRate(progress),
        [progress]
    )

    const totalStudyTime = useMemo(
        () => formatStudyTime(calculateTotalStudyTime(progress)),
        [progress]
    )

    const mostActiveDay = useMemo(
        () => getMostActiveDay(heatmapData),
        [heatmapData]
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gradient">K-POP Math</h1>
                    <Link
                        href="/dashboard"
                        className="text-kpop-purple hover:text-kpop-purple/80 font-medium flex items-center gap-1 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Page title */}
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-1">Learning Analytics</h2>
                    <p className="text-gray-500">Deep dive into your learning patterns and progress.</p>
                </div>

                {/* Summary stat cards */}
                <AnalyticsStatCards
                    topicsStudied={topicsStudied}
                    averageAccuracy={averageAccuracy}
                    totalStudyTime={totalStudyTime}
                    mostActiveDay={mostActiveDay}
                />

                {/* Row 1: Accuracy Trend + Strengths/Weaknesses */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <AccuracyTrendChart data={accuracyTrend} />
                    </div>
                    <div className="lg:col-span-1">
                        <StrengthsWeaknesses
                            strengths={insights.strengths}
                            weaknesses={insights.weaknesses}
                        />
                    </div>
                </div>

                {/* Row 2: Topic Analysis + Study Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <TopicAnalysisChart data={topicAnalysis} />
                    </div>
                    <div className="lg:col-span-1">
                        <StudyTimeHeatmap data={heatmapData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
