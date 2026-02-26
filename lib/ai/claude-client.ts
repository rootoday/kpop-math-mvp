import Anthropic from '@anthropic-ai/sdk'
import type {
  AIQuestion,
  GenerateQuestionRequest,
  GenerateQuestionResponse,
  GenerateFromScriptRequest,
  GenerateFromScriptResponse,
  GenerateFullLessonRequest,
  GenerateFullLessonResponse,
} from '@/types/ai'

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
  if (req.tier === 4) {
    return `You are a K-pop math tutor. Always respond in English. Create ONE fill-in-the-blank math problem.

Topic: ${req.topic}
Difficulty: ${req.difficulty}/5
K-pop Artist Theme: ${req.artistName}
Question Type: Fill in the blank (student types the answer)

Return ONLY valid JSON in English (no markdown, no backticks):
{
  "question": "question text here (use ___ for the blank)",
  "choices": [],
  "correctAnswer": "the exact correct answer",
  "explanation": "brief explanation"
}`
  }

  return `You are a K-pop math tutor. Always respond in English. Create ONE math problem.

Topic: ${req.topic}
Difficulty: ${req.difficulty}/5
K-pop Artist Theme: ${req.artistName}
Question Type: Multiple choice with 4 options

Return ONLY valid JSON in English (no markdown, no backticks):
{
  "question": "question text here",
  "choices": ["A", "B", "C", "D"],
  "correctAnswer": "the correct answer (must exactly match one of the choices)",
  "explanation": "brief explanation"
}`
}

// ─── Script Prompt Builder ───────────────────────────────────
function buildScriptPrompt(req: GenerateFromScriptRequest): string {
  const fullScript = [req.script.hook, req.script.body, req.script.cta]
    .filter(Boolean)
    .join('\n\n')

  const count = req.questionCount ?? 3
  const difficulty = req.difficulty ?? 3

  return `You are a K-pop math tutor who creates engaging math problems from viral video scripts.

Analyze the following video script and generate ${count} math question(s) based on the mathematical concepts discussed in it.

--- VIDEO SCRIPT ---
[Hook]
${req.script.hook}

[Body]
${req.script.body}

[CTA]
${req.script.cta}
--- END SCRIPT ---

Difficulty: ${difficulty}/5

Instructions:
1. First, analyze the script to identify the K-pop artist, math concept, and topic.
2. Then generate ${count} question(s), each with BOTH a Tier 3 (multiple choice) AND a Tier 4 (fill-in-the-blank) variant.
3. Questions MUST be directly related to the specific math content in the script. Use the same numbers, scenarios, and artist references from the script.
4. For Tier 3: provide exactly 4 options with one correct answer.
5. For Tier 4: provide fill-in-the-blank with the blank shown as ___ and include acceptable alternative answers.
6. All text must be in English.

Return ONLY valid JSON (no markdown, no backticks):
{
  "analysis": {
    "detectedArtist": "the K-pop artist/group name",
    "detectedMathConcept": "the broad math category (e.g. Algebra, Statistics, Geometry)",
    "detectedTopic": "the specific topic (e.g. quadratic equations, mean/median, probability)",
    "scriptSummary": "1-2 sentence summary of what the script teaches"
  },
  "questions": [
    {
      "tier3": {
        "questionText": "the multiple choice question",
        "options": [
          { "id": "a", "text": "option A", "isCorrect": false },
          { "id": "b", "text": "option B", "isCorrect": true },
          { "id": "c", "text": "option C", "isCorrect": false },
          { "id": "d", "text": "option D", "isCorrect": false }
        ],
        "hint": "brief explanation of the correct answer",
        "xpReward": 10
      },
      "tier4": {
        "questionText": "fill in the blank question with ___",
        "correctAnswer": "exact correct answer",
        "acceptableAnswers": ["alternative1", "alternative2"],
        "hint": "brief explanation",
        "xpReward": 15
      }
    }
  ]
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

// ─── Script-based Generation Function ────────────────────────
/**
 * Generate K-pop math questions from a video script via Claude API.
 *
 * Analyzes a viral video script (Hook + Body + CTA) and produces
 * contextually relevant math questions for both Tier 3 and Tier 4.
 */
export async function generateFromScript(
  request: GenerateFromScriptRequest
): Promise<GenerateFromScriptResponse> {
  try {
    const client = getClaudeClient()

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      temperature: TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: buildScriptPrompt(request),
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return { success: false, error: 'No text content in Claude response' }
    }

    const data = JSON.parse(textBlock.text)

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
    console.error('[claude-client] generateFromScript failed:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

// ─── Full Lesson Prompt Builder ──────────────────────────────
function buildFullLessonPrompt(req: GenerateFullLessonRequest): string {
  const difficulty = req.difficulty ?? 3

  return `You are a K-pop math tutor who creates complete educational lessons from viral video scripts.

Analyze the following video script and generate a COMPLETE lesson with all 5 tiers.

--- VIDEO SCRIPT ---
[Hook]
${req.script.hook}

[Body]
${req.script.body}

[CTA]
${req.script.cta}
--- END SCRIPT ---

Difficulty: ${difficulty}/5
${req.artistOverride ? `Artist Override: ${req.artistOverride}` : ''}

Generate a complete lesson with ALL 5 tiers:

**Tier 1 — Introduction**: Rewrite the script's body into an engaging introduction text for students. Keep the K-pop context and math connection. Make it feel like a fun discovery, not a textbook.

**Tier 2 — Step-by-Step Guide**: Break down the core math concept from the script into 3-5 clear, numbered steps. Each step should explain one part of the concept using the K-pop context from the script.

**Tier 3 — Multiple Choice Quiz**: Create ONE multiple choice question (4 options, exactly 1 correct) directly based on the math content in the script. Use the same numbers and scenarios.

**Tier 4 — Fill in the Blank Challenge**: Create ONE fill-in-the-blank question based on the script's math content. The blank should require calculating or recalling a specific answer from the script.

**Tier 5 — Celebration & Summary**: Write a congratulatory message and a brief summary of what was learned.

Also suggest a lesson title and difficulty level.

All text must be in English.

Return ONLY valid JSON (no markdown, no backticks):
{
  "analysis": {
    "detectedArtist": "the K-pop artist/group name",
    "detectedMathConcept": "the broad math category (e.g. Algebra, Statistics)",
    "detectedTopic": "the specific topic (e.g. quadratic equations, probability)",
    "scriptSummary": "1-2 sentence summary of what the script teaches"
  },
  "metadata": {
    "suggestedTitle": "a catchy lesson title combining the artist and math concept",
    "suggestedDifficulty": "beginner or intermediate or advanced"
  },
  "lesson": {
    "tier1": {
      "title": "Introduction",
      "shortDescription": "short 1-line description",
      "learningObjective": "what student will understand",
      "text": "the full introduction paragraph(s) rewritten from the script body",
      "estimatedMinutes": 5
    },
    "tier2": {
      "title": "Step-by-Step",
      "shortDescription": "short 1-line description",
      "learningObjective": "what student will learn to do",
      "steps": [
        { "stepNumber": 1, "text": "step 1 explanation" },
        { "stepNumber": 2, "text": "step 2 explanation" },
        { "stepNumber": 3, "text": "step 3 explanation" }
      ],
      "estimatedMinutes": 10
    },
    "tier3": {
      "title": "Practice Quiz",
      "shortDescription": "short 1-line description",
      "learningObjective": "test understanding",
      "questionText": "the multiple choice question",
      "options": [
        { "id": "a", "text": "option A", "isCorrect": false },
        { "id": "b", "text": "option B", "isCorrect": true },
        { "id": "c", "text": "option C", "isCorrect": false },
        { "id": "d", "text": "option D", "isCorrect": false }
      ],
      "hint": "brief hint or explanation",
      "xpReward": 10,
      "estimatedMinutes": 5
    },
    "tier4": {
      "title": "Challenge",
      "shortDescription": "short 1-line description",
      "learningObjective": "apply knowledge",
      "questionText": "fill in the blank question with ___",
      "correctAnswer": "exact correct answer",
      "acceptableAnswers": ["alternative1", "alternative2"],
      "hint": "brief hint",
      "xpReward": 15,
      "estimatedMinutes": 8
    },
    "tier5": {
      "congratsText": "congratulatory message with K-pop flair",
      "summaryText": "brief summary of what was learned",
      "totalXpReward": 50
    }
  }
}`
}

// ─── Full Lesson Generation Function ─────────────────────────
/**
 * Generate a complete K-pop math lesson (Tier 1~5) from a video script.
 *
 * Analyzes a viral video script and produces all 5 tiers of lesson content:
 * Introduction, Step-by-Step, Multiple Choice, Fill in Blank, and Celebration.
 */
export async function generateFullLesson(
  request: GenerateFullLessonRequest
): Promise<GenerateFullLessonResponse> {
  try {
    const client = getClaudeClient()

    const message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      temperature: TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: buildFullLessonPrompt(request),
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return { success: false, error: 'No text content in Claude response' }
    }

    const data = JSON.parse(textBlock.text)

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
    console.error('[claude-client] generateFullLesson failed:', errorMessage)
    return { success: false, error: errorMessage }
  }
}
