import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

// Client-side Supabase client with caching
export const createClient = () => {
    return createClientComponentClient<Database>()
}

// Singleton pattern for client-side
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
    if (!supabaseClient) {
        supabaseClient = createClientComponentClient<Database>()
    }
    return supabaseClient
}
