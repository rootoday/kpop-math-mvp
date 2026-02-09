import type {
    UserProgress,
    Lesson,
    AccuracyTrendPoint,
    TopicAnalysisData,
    HeatmapCell,
    TopicInsight,
} from '@/types'

// --- Constants ---

export const TIME_BLOCKS = [
    { label: 'Early\n5-8', start: 5, end: 8 },
    { label: 'Morning\n8-11', start: 8, end: 11 },
    { label: 'Midday\n11-14', start: 11, end: 14 },
    { label: 'Afternoon\n14-17', start: 14, end: 17 },
    { label: 'Evening\n17-20', start: 17, end: 20 },
    { label: 'Night\n20-5', start: 20, end: 5 },
] as const

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

// --- 1. Accuracy Trend (Line Chart) ---

export function computeAccuracyTrend(
    progress: UserProgress[],
    days: number = 30
): AccuracyTrendPoint[] {
    const now = new Date()
    const cutoff = new Date(now.getTime() - days * 86400000)

    const withData = progress.filter(
        p => p.last_accessed && p.attempts > 0 && new Date(p.last_accessed) >= cutoff
    )

    if (withData.length === 0) return []

    const grouped = new Map<string, { totalScore: number; count: number }>()

    for (const p of withData) {
        const dateKey = new Date(p.last_accessed!).toISOString().split('T')[0]
        const existing = grouped.get(dateKey) || { totalScore: 0, count: 0 }
        existing.totalScore += p.score
        existing.count += 1
        grouped.set(dateKey, existing)
    }

    return Array.from(grouped.entries())
        .map(([date, { totalScore, count }]) => ({
            date,
            dateLabel: new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
            accuracy: Math.round(totalScore / count),
            sessionCount: count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

// --- 2. Topic Analysis (Bar Chart) ---

export function computeTopicAnalysis(
    progress: UserProgress[],
    lessons: Lesson[]
): TopicAnalysisData[] {
    const lessonMap = new Map(lessons.map(l => [l.id, l]))
    const withAttempts = progress.filter(p => p.attempts > 0)

    if (withAttempts.length === 0) return []

    const grouped = new Map<
        string,
        { totalScore: number; totalAttempts: number; difficulty: string }
    >()

    for (const p of withAttempts) {
        const lesson = lessonMap.get(p.lesson_id)
        if (!lesson) continue

        const concept = lesson.math_concept
        const existing = grouped.get(concept) || {
            totalScore: 0,
            totalAttempts: 0,
            difficulty: lesson.difficulty,
        }
        existing.totalScore += p.score
        existing.totalAttempts += p.attempts
        // Keep the difficulty of the lesson with the most attempts
        grouped.set(concept, existing)
    }

    return Array.from(grouped.entries())
        .map(([mathConcept, data]) => ({
            mathConcept,
            shortLabel:
                mathConcept.length > 20
                    ? mathConcept.slice(0, 18) + '...'
                    : mathConcept,
            averageScore: Math.round(data.totalScore / (grouped.get(mathConcept)!.totalAttempts > 0
                ? Array.from(progress.filter(
                    p => p.attempts > 0 && lessonMap.get(p.lesson_id)?.math_concept === mathConcept
                )).length
                : 1)),
            attempts: data.totalAttempts,
            difficulty: data.difficulty as TopicAnalysisData['difficulty'],
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
}

// --- 3. Study Time Heatmap ---

function getTimeBlockIndex(hour: number): number {
    if (hour >= 5 && hour < 8) return 0
    if (hour >= 8 && hour < 11) return 1
    if (hour >= 11 && hour < 14) return 2
    if (hour >= 14 && hour < 17) return 3
    if (hour >= 17 && hour < 20) return 4
    return 5 // Night: 20-23, 0-4
}

export function computeStudyHeatmap(progress: UserProgress[]): HeatmapCell[] {
    // Initialize 7x6 grid
    const grid: { totalMinutes: number; sessionCount: number }[][] = Array.from(
        { length: 7 },
        () => Array.from({ length: 6 }, () => ({ totalMinutes: 0, sessionCount: 0 }))
    )

    for (const p of progress) {
        const timestamp = p.last_accessed || p.started_at
        if (!timestamp) continue

        const date = new Date(timestamp)
        const dayOfWeek = (date.getDay() + 6) % 7 // Mon=0, Sun=6
        const hour = date.getHours()
        const blockIdx = getTimeBlockIndex(hour)

        grid[dayOfWeek][blockIdx].totalMinutes += (p.time_spent || 0) / 60
        grid[dayOfWeek][blockIdx].sessionCount += 1
    }

    // Find max for normalization
    let maxMinutes = 0
    for (const row of grid) {
        for (const cell of row) {
            if (cell.totalMinutes > maxMinutes) maxMinutes = cell.totalMinutes
        }
    }

    // Flatten to array
    const cells: HeatmapCell[] = []
    for (let day = 0; day < 7; day++) {
        for (let block = 0; block < 6; block++) {
            const cell = grid[day][block]
            cells.push({
                dayOfWeek: day,
                timeBlock: block,
                totalMinutes: Math.round(cell.totalMinutes * 10) / 10,
                sessionCount: cell.sessionCount,
                intensity: maxMinutes > 0 ? cell.totalMinutes / maxMinutes : 0,
            })
        }
    }

    return cells
}

// --- 4. Strengths & Weaknesses ---

export function computeTopicInsights(
    progress: UserProgress[],
    lessons: Lesson[],
    topN: number = 3
): { strengths: TopicInsight[]; weaknesses: TopicInsight[] } {
    const lessonMap = new Map(lessons.map(l => [l.id, l]))
    const withAttempts = progress.filter(p => p.attempts > 0)

    if (withAttempts.length === 0) return { strengths: [], weaknesses: [] }

    // Group progress by topic
    const topicProgress = new Map<string, UserProgress[]>()
    for (const p of withAttempts) {
        const lesson = lessonMap.get(p.lesson_id)
        if (!lesson) continue
        const concept = lesson.math_concept
        const list = topicProgress.get(concept) || []
        list.push(p)
        topicProgress.set(concept, list)
    }

    const insights: TopicInsight[] = []

    for (const [mathConcept, records] of topicProgress.entries()) {
        const totalScore = records.reduce((sum, r) => sum + r.score, 0)
        const averageScore = Math.round(totalScore / records.length)
        const totalAttempts = records.reduce((sum, r) => sum + r.attempts, 0)

        // Determine difficulty from lessons
        const lessonForTopic = lessons.find(l => l.math_concept === mathConcept)
        const difficulty = (lessonForTopic?.difficulty || 'beginner') as TopicInsight['trend'] extends string ? 'beginner' | 'intermediate' | 'advanced' : never

        // Compute trend: compare older half vs recent half
        let trend: TopicInsight['trend'] = 'stable'
        if (records.length >= 2) {
            const sorted = [...records].sort((a, b) => {
                const ta = a.last_accessed || a.started_at || a.created_at
                const tb = b.last_accessed || b.started_at || b.created_at
                return new Date(ta).getTime() - new Date(tb).getTime()
            })
            const mid = Math.floor(sorted.length / 2)
            const olderAvg = sorted.slice(0, mid).reduce((s, r) => s + r.score, 0) / mid
            const recentAvg = sorted.slice(mid).reduce((s, r) => s + r.score, 0) / (sorted.length - mid)
            if (recentAvg > olderAvg + 5) trend = 'improving'
            else if (recentAvg < olderAvg - 5) trend = 'declining'
        }

        insights.push({
            mathConcept,
            averageScore,
            attempts: totalAttempts,
            trend,
            suggestion: '', // filled below
        })
    }

    // Sort and split into strengths/weaknesses
    insights.sort((a, b) => b.averageScore - a.averageScore)

    const strengths = insights.slice(0, topN).map(t => ({
        ...t,
        suggestion: generateSuggestion(t, true),
    }))

    const weaknesses = insights
        .slice(-topN)
        .reverse()
        .map(t => ({
            ...t,
            suggestion: generateSuggestion(t, false),
        }))

    return { strengths, weaknesses }
}

// --- 5. Suggestion Generator ---

function generateSuggestion(
    topic: { mathConcept: string; averageScore: number; trend: string },
    isStrength: boolean
): string {
    const name = topic.mathConcept

    if (isStrength) {
        if (topic.averageScore >= 90)
            return `You've mastered ${name}! Try tackling more advanced problems.`
        if (topic.averageScore >= 75 && topic.trend === 'improving')
            return 'Great momentum! Keep practicing to reach mastery.'
        if (topic.averageScore >= 75)
            return 'Solid understanding. Consider reviewing edge cases.'
        return `Good foundation in ${name}. Push for higher accuracy.`
    }

    if (topic.averageScore < 30)
        return `Start with the basics of ${name}. Review the lesson explanations first.`
    if (topic.averageScore < 50 && topic.trend === 'improving')
        return `You're making progress in ${name}! Keep at it with consistent practice.`
    if (topic.averageScore < 50 && topic.trend === 'declining')
        return `Try breaking ${name} into smaller steps. Focus on one sub-concept at a time.`
    return `Practice ${name} regularly. Focus on understanding the "why" behind each step.`
}

// --- 6. Heatmap Color Helper ---

export function getHeatmapColor(intensity: number): string {
    if (intensity <= 0) return '#EDE9FE'
    if (intensity <= 0.25) return '#DDD6FE'
    if (intensity <= 0.5) return '#C4B5FD'
    if (intensity <= 0.75) return '#A78BFA'
    return '#8B5CF6'
}

// --- 7. Most Active Day Helper ---

export function getMostActiveDay(heatmapData: HeatmapCell[]): string {
    const dayTotals = new Array(7).fill(0)
    for (const cell of heatmapData) {
        dayTotals[cell.dayOfWeek] += cell.totalMinutes
    }
    const maxIdx = dayTotals.indexOf(Math.max(...dayTotals))
    if (dayTotals[maxIdx] === 0) return 'N/A'
    return DAY_LABELS[maxIdx]
}
