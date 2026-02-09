'use client'

import { useReducedMotion } from 'framer-motion'

export function useMotionPreference() {
    const shouldReduceMotion = useReducedMotion()

    return {
        shouldReduceMotion: !!shouldReduceMotion,
        // Transition override: instant when reduced motion preferred
        transition: shouldReduceMotion ? { duration: 0 } : undefined,
        // Hover/tap helpers
        hoverScale: shouldReduceMotion ? {} : { scale: 1.05 },
        tapScale: shouldReduceMotion ? {} : { scale: 0.95 },
    }
}
