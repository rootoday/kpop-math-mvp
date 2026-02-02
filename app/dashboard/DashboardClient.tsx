'use client'

import { useRouter } from 'next/navigation'
import type { Lesson, UserProgress, User } from '@/types'
import { getSupabaseClient } from '@/lib/supabase/client'

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

    const completedLessonsCount = user.completed_lessons?.length || 0
    const totalLessons = lessons.length

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gradient">K-POP Math</h1>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                        Logout
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* User Stats */}
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-2">
                        Welcome back, {user.first_name}! 👋
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-kpop-purple">{user.xp_points}</div>
                            <div className="text-gray-600 text-sm mt-1">XP Points</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-kpop-purple">
                                {completedLessonsCount}/{totalLessons}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">Lessons</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-kpop-purple">{user.current_streak}</div>
                            <div className="text-gray-600 text-sm mt-1">Day Streak 🔥</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-3xl font-bold text-kpop-purple">{user.badges?.length || 0}</div>
                            <div className="text-gray-600 text-sm mt-1">Badges</div>
                        </div>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">Available Lessons</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => {
                            const lessonProgress = progress.find((p) => p.lesson_id === lesson.id)
                            const isCompleted = user.completed_lessons?.includes(lesson.id)

                            return (
                                <div
                                    key={lesson.id}
                                    className="card cursor-pointer hover:scale-105 transition-transform"
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
                                    <p className="text-gray-600 text-sm mb-3">🎵 {lesson.artist}</p>
                                    <p className="text-gray-700 mb-4">{lesson.math_concept}</p>

                                    {lessonProgress && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>Tier {lessonProgress.current_tier}/5</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-kpop-purple h-2 rounded-full transition-all"
                                                    style={{ width: `${(lessonProgress.current_tier / 5) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button className="btn-primary w-full text-sm">
                                        {isCompleted
                                            ? 'Review Lesson'
                                            : lessonProgress
                                                ? 'Continue'
                                                : 'Start Lesson'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {lessons.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                No lessons available yet. Check back soon! 🎵
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
