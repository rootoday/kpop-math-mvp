import type { ProgressWithLesson, Lesson, RecentActivityItem, UserProgress } from '@/types'

export function calculateAccuracyRate(progress: UserProgress[]): number {
    const withAttempts = progress.filter(p => p.attempts > 0)
    if (withAttempts.length === 0) return 0

    const totalScore = withAttempts.reduce((sum, p) => sum + p.score, 0)
    return Math.round(totalScore / withAttempts.length)
}

// time_spent is stored in seconds
export function calculateTotalStudyTime(progress: UserProgress[]): number {
    const totalSeconds = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0)
    return Math.round(totalSeconds / 60)
}

export function formatStudyTime(minutes: number): string {
    if (minutes < 1) return '0m'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remaining = minutes % 60
    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`
}

export function formatRelativeTime(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

export function deriveRecentActivity(
    progress: ProgressWithLesson[],
    lessons: Lesson[],
    limit: number = 5
): RecentActivityItem[] {
    const lessonMap = new Map(lessons.map(l => [l.id, l]))

    return progress
        .filter(p => p.last_accessed || p.completed_at || p.started_at)
        .map(p => {
            const joined = p.lessons              // join 데이터 우선 (getUserProgress에서 가져옴)
            const fallback = lessonMap.get(p.lesson_id)  // fallback: lessons 배열 lookup
            // 둘 다 없으면 orphan row → 최근활동에서 숨김
            if (!joined && !fallback) return null

            const timestamps = [p.last_accessed, p.completed_at, p.started_at]
                .filter(Boolean) as string[]
            const mostRecent = timestamps.sort(
                (a, b) => new Date(b).getTime() - new Date(a).getTime()
            )[0]

            let action: RecentActivityItem['action'] = 'continued'
            if (p.status === 'completed' && p.completed_at === mostRecent) {
                action = 'completed'
            } else if (p.started_at === mostRecent && p.current_tier <= 1) {
                action = 'started'
            }

            return {
                lessonId: p.lesson_id,
                lessonTitle: joined?.title ?? fallback!.title,
                artist: joined?.artist ?? fallback?.artist ?? '',
                score: p.score,
                xpEarned: p.xp_earned,
                action,
                timestamp: mostRecent,
                currentTier: p.current_tier,
            }
        })
        .filter((item): item is RecentActivityItem => item !== null)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
}
