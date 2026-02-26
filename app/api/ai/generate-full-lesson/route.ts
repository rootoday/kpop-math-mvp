import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { generateFullLesson } from '@/lib/ai/claude-client'
import { rateLimit } from '@/lib/rate-limit'
import type { GenerateFullLessonRequest } from '@/types/ai'
import type { Database } from '@/types/database.types'

// ─── Validation ──────────────────────────────────────────────
function isValidBody(body: unknown): body is GenerateFullLessonRequest {
    if (typeof body !== 'object' || body === null) return false
    const b = body as Record<string, unknown>

    // script must have at least hook or body
    if (typeof b.script !== 'object' || b.script === null) return false
    const script = b.script as Record<string, unknown>
    const hasHook = typeof script.hook === 'string' && script.hook.length > 0
    const hasBody = typeof script.body === 'string' && script.body.length > 0
    if (!hasHook && !hasBody) return false

    // difficulty is optional, but if provided must be 1-5
    if (b.difficulty !== undefined) {
        if (typeof b.difficulty !== 'number' || b.difficulty < 1 || b.difficulty > 5) {
            return false
        }
    }

    // artistOverride is optional string
    if (b.artistOverride !== undefined && typeof b.artistOverride !== 'string') {
        return false
    }

    return true
}

// ─── POST /api/ai/generate-full-lesson ──────────────────────
export async function POST(request: Request) {
    try {
        // Security: Require authentication
        const supabase = createRouteHandlerClient<Database>({ cookies })
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Security: Rate limit — 2 req/min per user (heavy operation)
        const { allowed, remaining, resetIn } = rateLimit(`ai-full-lesson:${user.id}`, 2, 60_000)
        if (!allowed) {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded. Try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil(resetIn / 1000)),
                        'X-RateLimit-Remaining': String(remaining),
                    },
                }
            )
        }

        const body = await request.json()

        if (!isValidBody(body)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        'Invalid request body. Required: script.hook or script.body (string). Optional: difficulty (1-5), artistOverride (string)',
                },
                { status: 400 }
            )
        }

        const result = await generateFullLesson(body)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            usage: result.usage,
        })
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
        console.error('[generate-full-lesson] Error:', errorMessage)
        return NextResponse.json(
            { success: false, error: process.env.NODE_ENV === 'production' ? 'An error occurred' : errorMessage },
            { status: 500 }
        )
    }
}
