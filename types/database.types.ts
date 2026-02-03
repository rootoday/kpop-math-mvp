export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            lessons: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title: string
                    artist: string
                    math_concept: string
                    difficulty: 'beginner' | 'intermediate' | 'advanced'
                    tier_content: any
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title: string
                    artist: string
                    math_concept: string
                    difficulty?: 'beginner' | 'intermediate' | 'advanced'
                    tier_content: any
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title?: string
                    artist?: string
                    math_concept?: string
                    difficulty?: 'beginner' | 'intermediate' | 'advanced'
                    tier_content?: any
                }
                Relationships: any[]
            }
            users: {
                Row: {
                    id: string
                    email: string
                    first_name: string | null
                    last_name: string | null
                    xp_points: number
                    badges: string[]
                    completed_lessons: string[]
                    current_streak: number
                    last_login_date: string | null
                    role: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    first_name?: string | null
                    last_name?: string | null
                    xp_points?: number
                    badges?: string[]
                    completed_lessons?: string[]
                    current_streak?: number
                    last_login_date?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string | null
                    last_name?: string | null
                    xp_points?: number
                    badges?: string[]
                    completed_lessons?: string[]
                    current_streak?: number
                    last_login_date?: string | null
                    role?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: any[]
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
                Relationships: any[]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

export type TierContent = any
export type Tier1Content = any
export type Tier2Content = any
export type Tier3Content = any
export type Tier4Content = any
export type Tier5Content = any
