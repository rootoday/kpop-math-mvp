import { NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/ai/claude-client'
import type { GenerateQuestionRequest } from '@/types/ai'

// ─── Validation ──────────────────────────────────────────────
function isValidBody(body: unknown): body is GenerateQuestionRequest {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.topic === 'string' &&
    b.topic.length > 0 &&
    typeof b.difficulty === 'number' &&
    b.difficulty >= 1 &&
    b.difficulty <= 5 &&
    typeof b.artistName === 'string' &&
    b.artistName.length > 0
  )
}

// ─── POST /api/ai/generate-question ─────────────────────────
export async function POST(request: Request) {
  try {
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
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
