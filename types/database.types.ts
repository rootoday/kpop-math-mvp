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
                    is_published: boolean
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
                    is_published?: boolean
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
                    is_published?: boolean
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
            lesson_progress: {
                Row: LessonProgress
                Insert: Omit<LessonProgress, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<LessonProgress, 'id' | 'created_at' | 'updated_at'>>
                Relationships: [
                    {
                        foreignKeyName: "lesson_progress_lesson_id_fkey"
                        columns: ["lesson_id"]
                        referencedRelation: "lessons"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "lesson_progress_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
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

// Base interface for all tiers with common metadata
export type TierLevel = 1 | 2 | 3 | 4 | 5;

export interface BaseTier {
    tier: TierLevel;
    title: string;
    shortDescription: string;
    learningObjective: string;
    estimatedMinutes: number;
}

// Specific content structures for each tier
export interface Tier1Content extends BaseTier {
    text: string;
    imageUrl: string;
    duration: number; // Kept for backward compatibility, sync with estimatedMinutes
}

export interface Tier2Content extends BaseTier {
    steps: Array<{ stepNumber: number; text: string; animation: string }>;
    duration: number;
}

export interface Tier3Content extends BaseTier {
    questionText: string;
    questionType: 'multiple_choice';
    options: Array<{ id: string; text: string; isCorrect: boolean }>;
    xpReward: number;
    hint: string;
}

export interface Tier4Content extends BaseTier {
    questionText: string;
    questionType: 'fill_in_blank';
    correctAnswer: string;
    acceptableAnswers: string[];
    inputType: 'text' | 'number';
    xpReward: number;
    hint: string;
}

export interface Tier5Content extends BaseTier {
    congratsText: string;
    summaryText: string;
    totalXpReward: number;
    badgeEarned: string | null;
    nextLessonId: string | null;
    celebrationAnimation: string;
}

// Consolidated type for the entire JSON column
export interface TierContent {
    tier1: Tier1Content;
    tier2: Tier2Content;
    tier3: Tier3Content;
    tier4: Tier4Content;
    tier5: Tier5Content;
}

// Extended Type for usage in App (overrides JSON type with strict interface)
export type LessonRow = Database['public']['Tables']['lessons']['Row']

/**
 * Complete lesson structure with strongly-typed tier content.
 *
 * Maps to the `lessons` table with `tier_content` JSONB overridden
 * from `any` to the strict `TierContent` interface.
 *
 * Fields:
 * - `id` — UUID primary key
 * - `title` — Lesson title (e.g. "Combining Like Terms with NewJeans")
 * - `artist` — K-pop artist name (e.g. "NewJeans")
 * - `math_concept` — Math topic covered (e.g. "Algebra")
 * - `difficulty` — 'beginner' | 'intermediate' | 'advanced'
 * - `is_published` — Whether the lesson is visible to students
 * - `tier_content` — Structured content for all 5 tiers (Tier1~Tier5)
 * - `created_at` / `updated_at` — Timestamps
 */
export interface FullLesson extends Omit<LessonRow, 'tier_content'> {
    tier_content: TierContent
}

/** Check if a lesson is in draft state (isDraft = !is_published) */
export function isLessonDraft(lesson: FullLesson): boolean {
    return !lesson.is_published
}

// Union type for problem-solving tiers
export type LessonProblem = Tier3Content | Tier4Content

export type LessonProgress = {
    id: string
    user_id: string
    lesson_id: string
    current_tier: 1 | 2 | 3 | 4 | 5
    completed_tiers: number[]
    last_accessed_at: string
    created_at: string
    updated_at: string
}
