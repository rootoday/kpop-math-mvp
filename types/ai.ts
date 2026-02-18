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
