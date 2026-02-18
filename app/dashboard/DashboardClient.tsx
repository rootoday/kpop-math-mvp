'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Lesson, UserProgress, User, LessonProgressChartData } from '@/types'
import { getSupabaseClient } from '@/lib/supabase/client'
import {
    calculateAccuracyRate,
    calculateTotalStudyTime,
    formatStudyTime,
    deriveRecentActivity,
} from '@/lib/dashboard/stats'
import { getRecommendedLessons } from '@/lib/dashboard/recommendations'
import FadeIn from '@/components/animations/FadeIn'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'
import ProgressBarAnimated from '@/components/ui/ProgressBarAnimated'
import Spinner from '@/components/ui/Spinner'
import AIQuickGenerate from './AIQuickGenerate'
import StatCards from './components/StatCards'
import RecentActivity from './components/RecentActivity'
import RecommendedLessons from './components/RecommendedLessons'

const ProgressChart = dynamic(() => import('./components/ProgressChart'), {
    loading: () => (
        <div className="card h-[300px] flex items-center justify-center">
            <Spinner size={32} />
        </div>
    ),
    ssr: false,
})

interface DashboardClientProps {
    lessons: Lesson[]
    progress: UserProgress[]
    user: User
}

export default function DashboardClient({ lessons, progress, user }: DashboardClientProps) {
    const router = useRouter()
    const supabase = getSupabaseClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const handleLessonClick = (lessonId: string) => {
        router.push(`/lessons/${lessonId}`)
    }

    // --- Computed dashboard data ---
    const stats = useMemo(() => ({
        completedCount: user.completed_lessons?.length || 0,
        totalCount: lessons.length,
        accuracyRate: calculateAccuracyRate(progress),
        totalStudyTime: formatStudyTime(calculateTotalStudyTime(progress)),
        currentStreak: user.current_streak,
    }), [user, lessons, progress])

    const chartData = useMemo<LessonProgressChartData[]>(() => {
        return progress
            .filter(p => p.status !== 'not_started')
            .map(p => {
                const lesson = lessons.find(l => l.id === p.lesson_id)
                return {
                    lessonTitle: lesson?.title || 'Unknown',
                    artist: lesson?.artist || '',
                    currentTier: p.current_tier,
                    progressPercent: (p.current_tier / 5) * 100,
                    difficulty: lesson?.difficulty || 'beginner',
                    status: p.status,
                }
            })
    }, [progress, lessons])

    const recentActivity = useMemo(
        () => deriveRecentActivity(progress, lessons, 5),
        [progress, lessons]
    )

    const recommendations = useMemo(
        () => getRecommendedLessons(lessons, progress, user.completed_lessons || [], 3),
        [lessons, progress, user.completed_lessons]
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gradient">K-POP Math</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/lessons" className="text-kpop-purple hover:text-kpop-purple/80 font-medium text-sm">
                            All Lessons
                        </Link>
                        <Link href="/analytics" className="text-kpop-purple hover:text-kpop-purple/80 font-medium text-sm">
                            Analytics
                        </Link>
                        <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome */}
                <FadeIn className="mb-8">
                    <h2 className="text-3xl font-bold mb-1">
                        Welcome back, {user.first_name}! 👋
                    </h2>
                    <p className="text-gray-500">Here&apos;s your learning progress overview.</p>
                </FadeIn>

                {/* 1. Statistics Cards */}
                <StatCards {...stats} />

                {/* 2. Progress Chart + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <ProgressChart data={chartData} />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentActivity items={recentActivity} onLessonClick={handleLessonClick} />
                    </div>
                </div>

                {/* 3. AI Quick Practice */}
                <div className="mb-8 max-w-md">
                    <AIQuickGenerate lessons={lessons} progress={progress} />
                </div>

                {/* 4. Recommended Lessons */}
                {recommendations.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h3 className="text-2xl font-bold">Recommended For You</h3>
                        </div>
                        <RecommendedLessons
                            recommendations={recommendations}
                            onLessonClick={handleLessonClick}
                        />
                    </div>
                )}

                {/* 5. All Lessons Grid */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">All Lessons</h3>
                    <StaggerContainer staggerDelay={0.06} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => {
                            const lessonProgress = progress.find((p) => p.lesson_id === lesson.id)
                            const isCompleted = user.completed_lessons?.includes(lesson.id)

                            return (
                                <motion.div
                                    key={lesson.id}
                                    variants={staggerItemVariants}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="card cursor-pointer"
                                    onClick={() => handleLessonClick(lesson.id)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span
                                            className={`badge ${lesson.difficulty === 'beginner'
                                                ? 'badge-beginner'
                                                : lesson.difficulty === 'intermediate'
                                                    ? 'badge-intermediate'
                                                    : 'badge-advanced'
                                                }`}
                                        >
                                            {lesson.difficulty}
                                        </span>
                                        {isCompleted && <span className="text-2xl">✅</span>}
                                    </div>

                                    <h4 className="text-xl font-bold mb-2">{lesson.title}</h4>
                                    <p className="text-gray-600 text-sm mb-3">{lesson.artist}</p>
                                    <p className="text-gray-700 mb-4">{lesson.math_concept}</p>

                                    {lessonProgress && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>Tier {lessonProgress.current_tier}/5</span>
                                            </div>
                                            <ProgressBarAnimated
                                                value={(lessonProgress.current_tier / 5) * 100}
                                            />
                                        </div>
                                    )}

                                    <button className="btn-primary w-full text-sm">
                                        {isCompleted
                                            ? 'Review Lesson'
                                            : lessonProgress
                                                ? 'Continue'
                                                : 'Start Lesson'}
                                    </button>
                                </motion.div>
                            )
                        })}
                    </StaggerContainer>

                    {lessons.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                No lessons available yet. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
