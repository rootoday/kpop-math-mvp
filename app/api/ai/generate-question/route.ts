import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { generateWithClaude } from '@/lib/ai/claude-client'
import { rateLimit } from '@/lib/rate-limit'
import type { GenerateQuestionRequest } from '@/types/ai'
import type { Database } from '@/types/database.types'

// ─── Validation ──────────────────────────────────────────────
function isValidBody(body: unknown): body is GenerateQuestionRequest {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  const baseValid =
    typeof b.topic === 'string' &&
    b.topic.length > 0 &&
    typeof b.difficulty === 'number' &&
    b.difficulty >= 1 &&
    b.difficulty <= 5 &&
    typeof b.artistName === 'string' &&
    b.artistName.length > 0
  if (!baseValid) return false
  // tier is optional, but if provided must be 3 or 4
  if (b.tier !== undefined && b.tier !== 3 && b.tier !== 4) return false
  return true
}

// ─── POST /api/ai/generate-question ─────────────────────────
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

    // Security: Rate limit — 5 AI requests per minute per user
    const { allowed, remaining, resetIn } = rateLimit(`ai:${user.id}`, 5, 60_000)
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
            'Invalid request body. Required: topic (string), difficulty (1-5), artistName (string)',
        },
        { status: 400 }
      )
    }

    const result = await generateWithClaude(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('[generate-question] Error:', errorMessage)
    return NextResponse.json(
      { success: false, error: process.env.NODE_ENV === 'production' ? 'An error occurred' : errorMessage },
      { status: 500 }
    )
  }
}
