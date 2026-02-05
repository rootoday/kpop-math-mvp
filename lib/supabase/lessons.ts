import { SupabaseClient } from '@supabase/supabase-js'
import type { Database, FullLesson, TierContent, TierLevel, LessonProblem, LessonProgress } from '@/types/database.types'

/**
 * Fetch a single lesson by ID
 */
export async function getLessonById(client: SupabaseClient<Database>, lessonId: string): Promise<FullLesson | null> {
    const { data, error } = await client
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

    if (error) {
        console.error('Error fetching lesson:', error)
        return null
    }

    return data as FullLesson
}

/**
 * Fetch all published lessons (for public/student view)
 */
export async function getPublishedLessons(client: SupabaseClient<Database>): Promise<FullLesson[]> {
    const { data, error } = await client
        .from('lessons')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching published lessons:', error)
        return []
    }

    return data as FullLesson[]
}

/**
 * Fetch lessons created by a specific user (admin/creator view)
 * Note: Currently schema doesn't have owner_id, but assuming RLS handles visibility or future field
 * For now, this just lists all lessons if the user has permission to see them
 */
export async function getUserLessons(client: SupabaseClient<Database>, userId: string): Promise<FullLesson[]> {
    // If we had an owner_id field: .eq('owner_id', userId)
    // For now, reliance on RLS and fetching all visible to the authenticated user
    const { data, error } = await client
        .from('lessons')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching user lessons:', error)
        return []
    }

    return data as FullLesson[]
}

/**
 * Create or Update a lesson
 */
export async function upsertLessonWithTiers(
    client: SupabaseClient<Database>,
    lesson: Partial<FullLesson>
): Promise<{ data: FullLesson | null; error: any }> {
    const { data, error } = await client
        .from('lessons')
        .upsert(lesson as any) // Cast needed because FullLesson.tier_content is stricter than JSON
        .select()
        .single()

    if (error) {
        console.error('Error upserting lesson:', error)
        return { data: null, error }
    }

    return { data: data as FullLesson, error: null }
}

/**
 * Extract specific tier content from a lesson
 */
export async function getTierContent(
    client: SupabaseClient<Database>,
    lessonId: string,
    tierNumber: TierLevel
): Promise<TierContent[keyof TierContent] | null> {
    const lesson = await getLessonById(client, lessonId)

    if (!lesson) return null

    const tierKey = `tier${tierNumber}` as keyof TierContent
    return lesson.tier_content[tierKey] || null
}

/**
 * Toggle the publication status of a lesson
 */
export async function togglePublishLesson(
    client: SupabaseClient<Database>,
    lessonId: string,
    isPublished: boolean
): Promise<boolean> {
    const { error } = await client
        .from('lessons')
        .update({ is_published: isPublished } as any)
        .eq('id', lessonId)

    if (error) {
        console.error('Error toggling publish status:', error)
        return false
    }

    return true
}

/**
 * Delete a lesson
 */
export async function deleteLesson(client: SupabaseClient<Database>, lessonId: string): Promise<boolean> {
    const { error } = await client
        .from('lessons')
        .delete()
        .eq('id', lessonId)

    if (error) {
        console.error('Error deleting lesson:', error)
        return false
    }

    return true
}

// ==========================================
// Lesson Progress Utilities
// ==========================================

/**
 * Fetch a user's progress for a specific lesson
 */
export async function getLessonProgress(
    client: SupabaseClient<Database>,
    userId: string,
    lessonId: string
): Promise<LessonProgress | null> {
    const { data, error } = await client
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single()

    if (error) {
        if (error.code !== 'PGRST116') { // Ignore "Row not found" errors, just return null
            console.error('Error fetching lesson progress:', error)
        }
        return null
    }

    return data as LessonProgress
}

/**
 * Initialize progress record for a user starting a lesson
 * Safe to call multiple times (idempotent)
 */
export async function initializeLessonProgress(
    client: SupabaseClient<Database>,
    userId: string,
    lessonId: string
): Promise<{ id: string; success: boolean }> {
    // Check existence first to avoid unique constraint errors in logs
    const existing = await getLessonProgress(client, userId, lessonId)
    if (existing) {
        return { id: existing.id, success: false }
    }

    const { data, error } = await client
        .from('lesson_progress')
        .insert({
            user_id: userId,
            lesson_id: lessonId,
            current_tier: 1,
            completed_tiers: [],
        } as any) // Cast for JSON/Array handling if needed
        .select('id')
        .single()

    if (error) {
        // Handle race condition if created between check and insert
        if (error.code === '23505') { // Unique violation
            const retry = await getLessonProgress(client, userId, lessonId)
            if (retry) return { id: retry.id, success: false }
        }
        console.error('Error initialzing progress:', error)
        throw new Error('Failed to initialize lesson progress')
    }

    return { id: data.id, success: true }
}

/**
 * Update progress when a tier is completed
 */
export async function updateLessonProgress(
    client: SupabaseClient<Database>,
    userId: string,
    lessonId: string,
    completedTier: TierLevel
): Promise<boolean> {
    const currentProgress = await getLessonProgress(client, userId, lessonId)

    if (!currentProgress) {
        console.error('Cannot update progress: Record not found')
        return false
    }

    // Logic: 
    // 1. Add to completed_tiers (no duplicates)
    // 2. Advance current_tier if not already ahead and not maxed

    const completedSet = new Set(currentProgress.completed_tiers)
    completedSet.add(completedTier)
    const newCompletedTiers = Array.from(completedSet).sort((a, b) => a - b) // Keep sorted

    // Determine next tier
    let nextTier = currentProgress.current_tier
    if (completedTier >= currentProgress.current_tier && currentProgress.current_tier < 5) {
        nextTier = (currentProgress.current_tier + 1) as TierLevel
    }

    const { error } = await client
        .from('lesson_progress')
        .update({
            completed_tiers: newCompletedTiers as any, // Cast for JSONB
            current_tier: nextTier,
            last_accessed_at: new Date().toISOString()
        })
        .eq('id', currentProgress.id)

    if (error) {
        console.error('Error updating progress:', error)
        return false
    }

    return true
}
