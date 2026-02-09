export type { Database, Json, TierContent, Tier1Content, Tier2Content, Tier3Content, Tier4Content, Tier5Content, FullLesson, BaseTier, TierLevel, LessonRow, LessonProblem, LessonProgress } from './database.types'
export { isLessonDraft } from './database.types'
import type { Database } from './database.types'

// Type aliases for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonInsert = Database['public']['Tables']['lessons']['Insert']
export type LessonUpdate = Database['public']['Tables']['lessons']['Update']

export type UserProgress = Database['public']['Tables']['user_progress']['Row']
export type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert']
export type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update']

// UI-specific types
export interface DashboardStats {
    xpPoints: number
    completedLessons: number
    totalLessons: number
    currentStreak: number
    badges: string[]
}

export interface LessonCardProps {
    lesson: Lesson
    progress?: UserProgress
    onClick: () => void
}

export interface TierComponentProps {
    content: any
    onComplete: (xp: number) => void
    onNext: () => void
}

// Form types
export interface SignUpFormData {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface LoginFormData {
    email: string
    password: string
}

// Dashboard chart data
export interface LessonProgressChartData {
    lessonTitle: string
    artist: string
    currentTier: number
    progressPercent: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    status: 'not_started' | 'in_progress' | 'completed'
}

// Dashboard recent activity
export interface RecentActivityItem {
    lessonId: string
    lessonTitle: string
    artist: string
    score: number
    xpEarned: number
    action: 'started' | 'continued' | 'completed'
    timestamp: string
    currentTier: number
}

// Dashboard recommended lesson
export interface RecommendedLesson {
    lesson: Lesson
    reason: string
    priority: number
    progress?: UserProgress
}

// API Response types
export interface ApiResponse<T> {
    data?: T
    error?: string
}

export interface LessonsResponse {
    lessons: Lesson[]
}

export interface ProgressResponse {
    progress: UserProgress[]
}

export interface UserResponse {
    user: User
}

// Analytics types
export interface AccuracyTrendPoint {
    date: string
    dateLabel: string
    accuracy: number
    sessionCount: number
}

export interface TopicAnalysisData {
    mathConcept: string
    shortLabel: string
    averageScore: number
    attempts: number
    difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface HeatmapCell {
    dayOfWeek: number
    timeBlock: number
    totalMinutes: number
    sessionCount: number
    intensity: number
}

export interface TopicInsight {
    mathConcept: string
    averageScore: number
    attempts: number
    trend: 'improving' | 'declining' | 'stable'
    suggestion: string
}
