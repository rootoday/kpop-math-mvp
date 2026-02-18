'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Lesson, UserProgress, User } from '@/types'
import { getSupabaseClient } from '@/lib/supabase/client'
import FadeIn from '@/components/animations/FadeIn'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'
import ProgressBarAnimated from '@/components/ui/ProgressBarAnimated'

interface LessonsPageClientProps {
    lessons: Lesson[]
    progress: UserProgress[]
    user: User
}

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced'

export default function LessonsPageClient({ lessons, progress, user }: LessonsPageClientProps) {
    const router = useRouter()
    const supabase = getSupabaseClient()
    const [filter, setFilter] = useState<DifficultyFilter>('all')

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const handleLessonClick = (lessonId: string) => {
        router.push(`/lessons/${lessonId}`)
    }

    const filteredLessons = filter === 'all'
        ? lessons
        : lessons.filter(l => l.difficulty === filter)

    const filters: { value: DifficultyFilter; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/dashboard" className="text-2xl font-bold text-gradient">K-POP Math</Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-kpop-purple hover:text-kpop-purple/80 font-medium text-sm">
                            Dashboard
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
                {/* Page Title */}
                <FadeIn className="mb-8">
                    <h2 className="text-3xl font-bold mb-1">All Lessons</h2>
                    <p className="text-gray-500">
                        {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} available
                        {' '}&middot;{' '}
                        {user.completed_lessons?.length || 0} completed
                    </p>
                </FadeIn>

                {/* Difficulty Filter */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {filters.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                filter === f.value
                                    ? 'bg-kpop-purple text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Lessons Grid */}
                <StaggerContainer staggerDelay={0.06} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson) => {
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

                {filteredLessons.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            {filter === 'all'
                                ? 'No lessons available yet. Check back soon!'
                                : `No ${filter} lessons available.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
