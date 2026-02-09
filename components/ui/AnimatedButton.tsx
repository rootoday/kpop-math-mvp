'use client'

import { motion, type Variants } from 'framer-motion'
import { forwardRef } from 'react'
import { useMotionPreference } from '@/lib/hooks/useMotionPreference'

type ButtonVariant = 'primary' | 'secondary' | 'accent'
type AnimationState = 'idle' | 'loading' | 'success' | 'error'

interface AnimatedButtonProps {
    variant?: ButtonVariant
    animationState?: AnimationState
    fullWidth?: boolean
    children: React.ReactNode
    className?: string
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    type?: 'button' | 'submit' | 'reset'
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-kpop-purple text-white hover:bg-opacity-90',
    secondary: 'bg-kpop-red text-white hover:bg-opacity-90',
    accent: 'bg-kpop-pink text-white hover:bg-opacity-90',
}

const shakeVariants: Variants = {
    shake: {
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.5 },
    },
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    (
        {
            variant = 'primary',
            animationState = 'idle',
            fullWidth,
            children,
            className = '',
            disabled,
            onClick,
            type,
        },
        ref
    ) => {
        const { shouldReduceMotion } = useMotionPreference()
        const isDisabled = disabled || animationState === 'loading'

        return (
            <motion.button
                ref={ref}
                whileHover={
                    isDisabled || shouldReduceMotion
                        ? {}
                        : { scale: 1.05, boxShadow: '0 4px 20px -2px rgba(139,92,246,0.3)' }
                }
                whileTap={isDisabled || shouldReduceMotion ? {} : { scale: 0.95 }}
                animate={animationState === 'error' ? 'shake' : undefined}
                variants={shakeVariants}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200
                    ${variantClasses[variant]}
                    ${fullWidth ? 'w-full' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}`}
                disabled={isDisabled}
                onClick={onClick}
                type={type}
            >
                {animationState === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                        <motion.span
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Loading...
                    </span>
                ) : animationState === 'success' ? (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </svg>
                        Done!
                    </motion.span>
                ) : (
                    children
                )}
            </motion.button>
        )
    }
)

AnimatedButton.displayName = 'AnimatedButton'
export default AnimatedButton
