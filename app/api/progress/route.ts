import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        .eq('user_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress: data })
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lesson_id, current_tier, score, xp_earned, status, time_spent } = body

    // First, get existing progress to increment attempts
    const { data: existing } = await supabase
        .from('user_progress')
        .select('attempts')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson_id)
        .single()

    const newAttempts = (existing?.attempts || 0) + 1

    const { data, error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            lesson_id,
            current_tier,
            score,
            xp_earned,
            status,
            time_spent,
            attempts: newAttempts,
            last_accessed: new Date().toISOString(),
            started_at: existing ? undefined : new Date().toISOString(),
            completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update user XP if lesson completed
    if (status === 'completed' && xp_earned) {
        await supabase.rpc('increment_user_xp', {
            user_id: user.id,
            xp_amount: xp_earned
        })
    }

    return NextResponse.json({ progress: data })
}
