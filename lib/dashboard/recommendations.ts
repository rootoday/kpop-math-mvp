import type { Lesson, UserProgress, RecommendedLesson } from '@/types'

export function getRecommendedLessons(
    lessons: Lesson[],
    progress: UserProgress[],
    completedLessonIds: string[],
    limit: number = 3
): RecommendedLesson[] {
    const progressMap = new Map(progress.map(p => [p.lesson_id, p]))
    const recommendations: RecommendedLesson[] = []

    for (const lesson of lessons) {
        if (!lesson.is_published) continue

        const prog = progressMap.get(lesson.id)
        const isCompleted = completedLessonIds.includes(lesson.id)

        if (prog && prog.status === 'in_progress') {
            recommendations.push({
                lesson,
                reason: `Continue from Tier ${prog.current_tier}/5`,
                priority: 100 - prog.current_tier,
                progress: prog,
            })
            continue
        }

        if (!prog || prog.status === 'not_started') {
            const difficultyWeight =
                lesson.difficulty === 'beginner' ? 80 :
                    lesson.difficulty === 'intermediate' ? 60 : 40

            recommendations.push({
                lesson,
                reason: 'New lesson to explore',
                priority: difficultyWeight,
            })
            continue
        }

        if (isCompleted && prog && prog.score < 70) {
            recommendations.push({
                lesson,
                reason: `Review to improve your ${prog.score}% score`,
                priority: 30,
                progress: prog,
            })
        }
    }

    return recommendations
        .sort((a, b) => b.priority - a.priority)
        .slice(0, limit)
}
