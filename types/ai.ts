/**
 * AI question generation types for the K-pop Math platform.
 *
 * These types define the contract between the API route,
 * the Claude client, and the frontend.
 */

/** A single AI-generated math question with K-pop context */
export interface AIQuestion {
  question: string
  choices: string[]
  correctAnswer: string
  explanation: string
}

/** Request body for POST /api/ai/generate-question */
export interface GenerateQuestionRequest {
  topic: string
  difficulty: number   // 1-5
  artistName: string
  tier?: number        // 3 = multiple choice, 4 = fill in blank
}

/** Response from the generate-question endpoint */
export interface GenerateQuestionResponse {
  success: boolean
  data?: AIQuestion
  error?: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

// ─── Script-based Question Generation ───────────────────────

/** A complete video script composed of Hook + Body + CTA */
export interface VideoScript {
  hook: string
  body: string
  cta: string
}

/** Request body for POST /api/ai/generate-from-script */
export interface GenerateFromScriptRequest {
  script: VideoScript
  questionCount?: number  // How many questions to generate (default: 3)
  difficulty?: number     // 1-5 (default: 3)
}

/** A single generated question set (both tier 3 and tier 4 variants) */
export interface ScriptGeneratedQuestion {
  tier3: {
    questionText: string
    options: { id: string; text: string; isCorrect: boolean }[]
    hint: string
    xpReward: number
  }
  tier4: {
    questionText: string
    correctAnswer: string
    acceptableAnswers: string[]
    hint: string
    xpReward: number
  }
}

/** Metadata extracted from the script by AI */
export interface ScriptAnalysis {
  detectedArtist: string
  detectedMathConcept: string
  detectedTopic: string
  scriptSummary: string
}

/** Response from the generate-from-script endpoint */
export interface GenerateFromScriptResponse {
  success: boolean
  data?: {
    analysis: ScriptAnalysis
    questions: ScriptGeneratedQuestion[]
  }
  error?: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

// ─── Full Lesson Generation (Tier 1~5) ─────────────────────

/** AI-generated full lesson content (Tier 1~5) */
export interface FullLessonGenerated {
  tier1: {
    title: string
    shortDescription: string
    learningObjective: string
    text: string
    estimatedMinutes: number
  }
  tier2: {
    title: string
    shortDescription: string
    learningObjective: string
    steps: { stepNumber: number; text: string }[]
    estimatedMinutes: number
  }
  tier3: {
    title: string
    shortDescription: string
    learningObjective: string
    questionText: string
    options: { id: string; text: string; isCorrect: boolean }[]
    hint: string
    xpReward: number
    estimatedMinutes: number
  }
  tier4: {
    title: string
    shortDescription: string
    learningObjective: string
    questionText: string
    correctAnswer: string
    acceptableAnswers: string[]
    hint: string
    xpReward: number
    estimatedMinutes: number
  }
  tier5: {
    congratsText: string
    summaryText: string
    totalXpReward: number
  }
}

/** Request body for POST /api/ai/generate-full-lesson */
export interface GenerateFullLessonRequest {
  script: VideoScript
  difficulty?: number       // 1-5 (default: 3)
  artistOverride?: string   // Override detected artist
}

/** Metadata suggested by AI for the lesson */
export interface LessonMetadata {
  suggestedTitle: string
  suggestedDifficulty: 'beginner' | 'intermediate' | 'advanced'
}

/** Response from the generate-full-lesson endpoint */
export interface GenerateFullLessonResponse {
  success: boolean
  data?: {
    analysis: ScriptAnalysis
    lesson: FullLessonGenerated
    metadata: LessonMetadata
  }
  error?: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}
