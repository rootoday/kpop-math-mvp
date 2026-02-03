export type TierContent = {
    tier1: Tier1Content
    tier2: Tier2Content
    tier3: Tier3Content
    tier4: Tier4Content
    tier5: Tier5Content
}

export interface Tier1Content {
    title: string
    text: string
    imageUrl: string
    duration: number
}

export interface Tier2Content {
    title: string
    steps: Array<{
        stepNumber: number
        text: string
        animation: string
    }>
    duration: number
}

export interface Tier3Content {
    questionText: string
    questionType: 'multiple_choice'
    options: Array<{
        id: string
        text: string
        isCorrect: boolean
    }>
    xpReward: number
    hint?: string
}

export interface Tier4Content {
    questionText: string
    questionType: 'fill_in_blank'
    correctAnswer: string
    acceptableAnswers: string[]
    inputType: 'text'
    xpReward: number
    hint?: string
}

export interface Tier5Content {
    congratsText: string
    summaryText: string
    totalXpReward: number
    badgeEarned: string | null
    nextLessonId: string | null
    celebrationAnimation: string
}
