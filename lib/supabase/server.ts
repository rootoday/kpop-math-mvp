import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'
import { cache } from 'react'

// Server-side Supabase client factory
export const createServerClient = () => {
    return createServerComponentClient<Database>({
        cookies: () => cookies()
    })
}

// Cached data fetchers
export const getCachedLessons = cache(async (difficulty?: 'beginner' | 'intermediate' | 'advanced') => {
    const supabase = createServerClient()

    let query = (supabase as any)
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: true })

    if (difficulty) {
        query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) throw error
    return data
})

export const getCachedUserProgress = cache(async (userId: string) => {
    const supabase = createServerClient()

    const { data, error } = await (supabase as any)
        .from('user_progress')
        .select(`
      *,
      lessons (
        id,
        title,
        artist,
        difficulty
      )
    `)
        .eq('user_id', userId)

    if (error) throw error
    return data
})

export const getCachedUser = cache(async (userId: string) => {
    const supabase = createServerClient()

    const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
        console.error('Error fetching user profile:', error)
        return null
    }

    return data
})
