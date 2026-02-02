// Environment variable validation and type-safe access
export const env = {
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    site: {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    ai: {
        anthropicKey: process.env.ANTHROPIC_API_KEY,
        elevenLabsKey: process.env.ELEVENLABS_API_KEY,
    },
    features: {
        enableAdmin: process.env.NEXT_PUBLIC_ENABLE_ADMIN === 'true',
        enableTTS: process.env.NEXT_PUBLIC_ENABLE_TTS === 'true',
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    },
    performance: {
        maxLessonsPerPage: parseInt(process.env.NEXT_PUBLIC_MAX_LESSONS_PER_PAGE || '12'),
        cacheRevalidateSeconds: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE_SECONDS || '3600'),
    },
} as const

// Validate required environment variables
export function validateEnv() {
    const required = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]

    const missing = required.filter(key => !process.env[key])

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
}
