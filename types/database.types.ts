export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    Public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    first_name: string
                    last_name: string
                    xp_points: number
                    badges: string[]
                    completed_lessons: string[]
                    current_streak: number
                    last_login_date: string | null
                    role: 'user' | 'admin'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    first_name: string
                    last_name: string
                    xp_points?: number
                    badges?: string[]
                    completed_lessons?: string[]
                    current_streak?: number
                    last_login_date?: string | null
                    role?: 'user' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string
                    last_name?: string
                    xp_points?: number
                    badges?: string[]
                    completed_lessons?: string[]
                    current_streak?: number
                    last_login_date?: string | null
                    role?: 'user' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
            }
            lessons: {
                Row: {
                    id: string
                    title: string
                    artist: string
                    math_concept: string
                    difficulty: 'beginner' | 'intermediate' | 'advanced'
                    tier_content: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    artist: string
                    math_concept: string
                    difficulty?: 'beginner' | 'intermediate' | 'advanced'
                    tier_content: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    artist?: string
                    math_concept?: string
                    difficulty?: 'beginner' | 'intermediate' | 'advanced'
                    tier_content?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            user_progress: {
                Row: {
                    id: string
                    user_id: string
                    lesson_id: string
                    current_tier: number
                    score: number
                    xp_earned: number
                    status: 'not_started' | 'in_progress' | 'completed'
                    attempts: number
                    time_spent: number
                    last_accessed: string | null
                    started_at: string | null
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    lesson_id: string
                    current_tier?: number
                    score?: number
                    xp_earned?: number
                    status?: 'not_started' | 'in_progress' | 'completed'
                    attempts?: number
                    time_spent?: number
                    last_accessed?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    lesson_id?: string
                    current_tier?: number
                    score?: number
                    xp_earned?: number
                    status?: 'not_started' | 'in_progress' | 'completed'
                    attempts?: number
                    time_spent?: number
                    last_accessed?: string | null
                    started_at?: string | null
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            increment_user_xp: {
                Args: {
                    user_id: string
                    xp_amount: number
                }
                Returns: void
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Tier Content Types
export interface TierContent {
    tier1: Tier1Content
    tier2: Tier2Content
    tier3: Tier3Content
    tier4: Tier4Content
    tier5: Tier5Content
}

export interface Tier1Content {
    title: string
    text: string
    imageUrl: string
    duration: number
}

export interface Tier2Content {
    title: string
    steps: Array<{
        stepNumber: number
        text: string
        animation: string
    }>
    duration: number
}

export interface Tier3Content {
    questionText: string
    questionType: 'multiple_choice'
    options: Array<{
        id: string
        text: string
        isCorrect: boolean
    }>
    xpReward: number
    hint?: string
}

export interface Tier4Content {
    questionText: string
    questionType: 'fill_in_blank'
    correctAnswer: string
    acceptableAnswers: string[]
    inputType: 'text'
    xpReward: number
    hint?: string
}

export interface Tier5Content {
    congratsText: string
    summaryText: string
    totalXpReward: number
    badgeEarned: string | null
    nextLessonId: string | null
    celebrationAnimation: string
}
