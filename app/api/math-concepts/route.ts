import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'

export async function GET() {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const { data, error } = await (supabase as any)
        .from('math_concepts')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

    if (error) {
        return NextResponse.json(
            { error: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({ concepts: data })
}
