// Simple in-memory rate limiter for API routes
// For production, consider using @vercel/kv or Redis

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60_000 // 1 minute
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}, CLEANUP_INTERVAL)

/**
 * Simple in-memory rate limiter.
 * @param identifier - Unique key (e.g., user ID or IP)
 * @param maxRequests - Max requests per window
 * @param windowMs - Time window in milliseconds
 * @returns { allowed, remaining, resetIn }
 */
export function rateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now()
    const entry = rateLimitMap.get(identifier)

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
        return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
    }

    entry.count++
    const remaining = Math.max(0, maxRequests - entry.count)
    const resetIn = entry.resetTime - now

    return {
        allowed: entry.count <= maxRequests,
        remaining,
        resetIn,
    }
}
