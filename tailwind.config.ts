import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Preserved names (backward compatible, hex values updated)
                'kpop-purple': '#8B5CF6',    // was #9B59B6 → Tailwind violet-500
                'kpop-red': '#E60031',        // UNCHANGED
                'music-green': '#10B981',     // was #1DB954 → Tailwind emerald-500
                'bg-light': '#F5F5F5',        // UNCHANGED
                'text-dark': '#1A1A1A',       // UNCHANGED
                // New additions
                'kpop-pink': '#EC4899',       // Tailwind pink-500
                'kpop-blue': '#3B82F6',       // Tailwind blue-500
                'kpop-yellow': '#F59E0B',     // Tailwind amber-500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Inter', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'kpop': '1rem',
            },
            boxShadow: {
                'kpop': '0 4px 20px -2px rgba(139,92,246,0.25), 0 2px 8px -2px rgba(236,72,153,0.15)',
                'neon': '0 0 15px rgba(139,92,246,0.5), 0 0 45px rgba(139,92,246,0.2)',
            },
            keyframes: {
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
            animation: {
                'scale-in': 'scaleIn 0.3s ease-out',
                'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}

export default config
