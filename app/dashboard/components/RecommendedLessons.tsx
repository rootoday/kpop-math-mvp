'use client'

import { motion } from 'framer-motion'
import type { RecommendedLesson } from '@/types'
import StaggerContainer, { staggerItemVariants } from '@/components/animations/StaggerContainer'
import ProgressBarAnimated from '@/components/ui/ProgressBarAnimated'

interface RecommendedLessonsProps {
    recommendations: RecommendedLesson[]
    onLessonClick: (lessonId: string) => void
}

function getReasonStyle(reason: string) {
    if (reason.startsWith('Continue')) {
        return 'bg-music-green/10 text-music-green'
    }
    if (reason.startsWith('New')) {
        return 'bg-kpop-purple/10 text-kpop-purple'
    }
    return 'bg-amber-100 text-amber-700'
}

function getButtonLabel(reason: string) {
    if (reason.startsWith('Continue')) return 'Continue'
    if (reason.startsWith('New')) return 'Start'
    return 'Review'
}

export default function RecommendedLessons({ recommendations, onLessonClick }: RecommendedLessonsProps) {
    return (
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
                <motion.div
                    key={rec.lesson.id}
                    variants={staggerItemVariants}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="card cursor-pointer"
                    onClick={() => onLessonClick(rec.lesson.id)}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span
                            className={`badge ${
                                rec.lesson.difficulty === 'beginner'
                                    ? 'badge-beginner'
                                    : rec.lesson.difficulty === 'intermediate'
                                        ? 'badge-intermediate'
                                        : 'badge-advanced'
                            }`}
                        >
                            {rec.lesson.difficulty}
                        </span>
                        <svg className="w-5 h-5 text-kpop-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{rec.lesson.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{rec.lesson.artist}</p>

                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${getReasonStyle(rec.reason)}`}>
                        {rec.reason}
                    </span>

                    {rec.progress && rec.progress.status === 'in_progress' && (
                        <div className="mb-3">
                            <ProgressBarAnimated
                                value={(rec.progress.current_tier / 5) * 100}
                                height="h-1.5"
                            />
                        </div>
                    )}

                    <button className="btn-primary w-full text-sm">
                        {getButtonLabel(rec.reason)}
                    </button>
                </motion.div>
            ))}
        </StaggerContainer>
    )
}
