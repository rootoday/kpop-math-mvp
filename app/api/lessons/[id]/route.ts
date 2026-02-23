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
// Writes an AI-generated question to the appropriate tier (tier3/tier4)
// in tier_content, and also appends to ai_questions for history tracking.
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Security: Only admins can modify lesson content
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const { data: userData } = await (supabase as any)
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!userData || userData.role !== 'admin') {
        return NextResponse.json(
            { success: false, error: 'Forbidden: admin access required' },
            { status: 403 }
        )
    }

    let body: { question: AIQuestion; tier?: number }
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

    // 2. Build updated tier_content with the question mapped to the correct tier
    const tierContent = (lesson.tier_content ?? {}) as Record<string, unknown>
    const tier = body.tier ?? 3

    // Write to the actual tier fields that the lesson player reads
    if (tier === 4) {
        tierContent.tier4 = {
            ...(tierContent.tier4 as Record<string, unknown> ?? {}),
            questionText: body.question.question,
            questionType: 'fill_in_blank',
            correctAnswer: body.question.correctAnswer,
            acceptableAnswers: [],
            hint: body.question.explanation,
        }
    } else {
        tierContent.tier3 = {
            ...(tierContent.tier3 as Record<string, unknown> ?? {}),
            questionText: body.question.question,
            questionType: 'multiple_choice',
            options: body.question.choices.map((c: string, i: number) => ({
                id: String.fromCharCode(97 + i),
                text: c,
                isCorrect: c === body.question.correctAnswer,
            })),
            hint: body.question.explanation,
        }
    }

    // Also append to ai_questions for history tracking
    const existingQuestions = Array.isArray(tierContent.ai_questions)
        ? tierContent.ai_questions as AIQuestion[]
        : []

    tierContent.ai_questions = [...existingQuestions, body.question]

    // 3. Persist to Supabase
    const { error: updateError } = await (supabase as any)
        .from('lessons')
        .update({
            tier_content: tierContent,
            updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)

    if (updateError) {
        return NextResponse.json(
            { success: false, error: updateError.message },
            { status: 500 }
        )
    }

    const tierLabel = tier === 4 ? 'Tier 4' : 'Tier 3'
    return NextResponse.json({
        success: true,
        data: { questionsCount: existingQuestions.length + 1, tier: tierLabel },
    })
}
