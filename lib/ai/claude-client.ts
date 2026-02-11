import Anthropic from '@anthropic-ai/sdk'
import type { AIQuestion, GenerateQuestionRequest, GenerateQuestionResponse } from '@/types/ai'

// ─── Configuration ───────────────────────────────────────────
const CLAUDE_MODEL = 'claude-sonnet-4-20250514' as const
const MAX_TOKENS = 512
const TEMPERATURE = 0.7

// ─── Singleton Client ────────────────────────────────────────
let _client: Anthropic | null = null

/**
 * Returns a singleton Anthropic client.
 * Server-side only — relies on process.env.ANTHROPIC_API_KEY.
 *
 * @throws {Error} if ANTHROPIC_API_KEY is not set
 */
export function getClaudeClient(): Anthropic {
  if (_client) return _client

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to your .env.local file.'
    )
  }

  _client = new Anthropic({ apiKey })
  return _client
}

// ─── Prompt Builder ──────────────────────────────────────────
function buildPrompt(req: GenerateQuestionRequest): string {
  return `You are a K-pop math tutor. Always respond in English. Create ONE math problem.

Topic: ${req.topic}
Difficulty: ${req.difficulty}/5
K-pop Artist Theme: ${req.artistName}

Return ONLY valid JSON in English (no markdown, no backticks):
{
  "question": "question text here",
  "choices": ["A", "B", "C", "D"],
  "correctAnswer": "the correct answer",
  "explanation": "brief explanation"
}`
}

// ─── Main Generation Function ────────────────────────────────
/**
 * Generate a K-pop math question via the Claude API.
 *
 * Server-side only. Returns a typed response with the
 * generated question or an error message.
 */
export async function generateWithClaude(
  request: GenerateQuestionRequest
): Promise<GenerateQuestionResponse> {
  try {
    const client = getClaudeClient()

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: buildPrompt(request),
        },
      ],
    })

    // Extract text block from response
    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return { success: false, error: 'No text content in Claude response' }
    }

    const data: AIQuestion = JSON.parse(textBlock.text)

    return {
      success: true,
      data,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error from Claude API'
    console.error('[claude-client] generateWithClaude failed:', errorMessage)
    return { success: false, error: errorMessage }
  }
}
