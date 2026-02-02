import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')

    let query = supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: true })

    if (difficulty) {
        query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lessons: data })
}
