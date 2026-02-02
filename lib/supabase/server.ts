import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'
import { cache } from 'react'

// Server-side Supabase client with React cache
export const createServerClient = cache(() => {
    return createServerComponentClient<Database>({ cookies })
})

// Cached data fetchers
export const getCachedLessons = cache(async (difficulty?: string) => {
    const supabase = createServerClient()

    let query = supabase
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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data
})
