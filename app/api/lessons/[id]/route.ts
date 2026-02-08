import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import type { AIQuestion } from '@/types/ai'

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ lesson: data })
}

// ─── PATCH /api/lessons/[id] ────────────────────────────────
// Appends an AI-generated question to tier_content.ai_questions
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    let body: { question: AIQuestion }
    try {
        body = await request.json()
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid JSON body' },
            { status: 400 }
        )
    }

    if (
        !body.question ||
        typeof body.question.question !== 'string' ||
        !Array.isArray(body.question.choices)
    ) {
        return NextResponse.json(
            { success: false, error: 'Missing required field: question (with question, choices, correctAnswer, explanation)' },
            { status: 400 }
        )
    }

    // 1. Fetch current lesson tier_content
    const { data: lesson, error: fetchError } = await (supabase as any)
        .from('lessons')
        .select('tier_content')
        .eq('id', params.id)
        .single() as { data: { tier_content: unknown } | null; error: any }

    if (fetchError || !lesson) {
        return NextResponse.json(
            { success: false, error: fetchError?.message ?? 'Lesson not found' },
            { status: 404 }
        )
    }

    // 2. Append to ai_questions array inside tier_content
    const tierContent = (lesson.tier_content ?? {}) as Record<string, unknown>
    const existingQuestions = Array.isArray(tierContent.ai_questions)
        ? tierContent.ai_questions as AIQuestion[]
        : []

    const updatedTierContent = {
        ...tierContent,
        ai_questions: [...existingQuestions, body.question],
    }

    // 3. Persist to Supabase
    const { error: updateError } = await (supabase as any)
        .from('lessons')
        .update({
            tier_content: updatedTierContent,
            updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)

    if (updateError) {
        return NextResponse.json(
            { success: false, error: updateError.message },
            { status: 500 }
        )
    }

    return NextResponse.json({
        success: true,
        data: { questionsCount: existingQuestions.length + 1 },
    })
}
