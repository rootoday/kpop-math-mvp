'use client'

import { motion, AnimatePresence } from 'framer-motion'
import AnimatedButton from './AnimatedButton'

interface BaseQuestionProps {
    showFeedback: boolean
    isCorrect: boolean
    xpReward?: number
    hint?: string
    onCheckAnswer: () => void
    onTryAgain: () => void
    onContinue: () => void
    onPrevious: () => void
    canCheck: boolean
}

interface MultipleChoiceProps extends BaseQuestionProps {
    type: 'multiple_choice'
    questionText: string
    options: Array<{ id: string; text: string; isCorrect: boolean }>
    selectedAnswer: string | null
    onSelectAnswer: (id: string) => void
}

interface FillInBlankProps extends BaseQuestionProps {
    type: 'fill_in_blank'
    questionText: string
    textAnswer: string
    onTextChange: (value: string) => void
    inputType?: 'text' | 'number'
    onEnterSubmit: () => void
}

type QuestionCardProps = MultipleChoiceProps | FillInBlankProps

const cardSpring = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
}

const shakeAnimation = {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.4 },
}

export default function QuestionCard(props: QuestionCardProps) {
    const {
        type,
        questionText,
        showFeedback,
        isCorrect,
        xpReward,
        hint,
        onCheckAnswer,
        onTryAgain,
        onContinue,
        onPrevious,
        canCheck,
    } = props

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={cardSpring}
        >
            <p className="text-lg font-medium mb-6">{questionText}</p>

            {/* Multiple Choice Options */}
            {type === 'multiple_choice' && (
                <div className="space-y-3 mb-6">
                    {props.options.map(option => {
                        const isSelected = props.selectedAnswer === option.id
                        const showCorrect = showFeedback && option.isCorrect
                        const showWrong = showFeedback && isSelected && !option.isCorrect

                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => !showFeedback && props.onSelectAnswer(option.id)}
                                disabled={showFeedback}
                                whileHover={
                                    showFeedback
                                        ? {}
                                        : {
                                              y: -2,
                                              boxShadow: '0 4px 12px rgba(139,92,246,0.15)',
                                          }
                                }
                                whileTap={showFeedback ? {} : { scale: 0.98 }}
                                animate={
                                    showCorrect
                                        ? { scale: [1, 1.02, 1], transition: { duration: 0.4 } }
                                        : showWrong
                                          ? shakeAnimation
                                          : {}
                                }
                                className={`w-full p-4 text-left rounded-lg border-2 transition-colors
                                    ${
                                        showCorrect
                                            ? 'border-music-green bg-green-50'
                                            : showWrong
                                              ? 'border-red-400 bg-red-50'
                                              : isSelected
                                                ? 'border-kpop-purple bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-400'
                                    }
                                    ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                <span className="font-medium text-gray-400 mr-3">
                                    {option.id.toUpperCase()}.
                                </span>
                                {option.text}
                            </motion.button>
                        )
                    })}
                </div>
            )}

            {/* Fill in Blank Input */}
            {type === 'fill_in_blank' && (
                <input
                    type={props.inputType === 'number' ? 'number' : 'text'}
                    value={props.textAnswer}
                    onChange={e => props.onTextChange(e.target.value)}
                    onKeyDown={e =>
                        e.key === 'Enter' &&
                        props.textAnswer &&
                        !showFeedback &&
                        props.onEnterSubmit()
                    }
                    placeholder="Type your answer..."
                    className="input-field mb-6 text-lg"
                    disabled={showFeedback && isCorrect}
                />
            )}

            {/* Feedback Message */}
            <AnimatePresence mode="wait">
                {showFeedback && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-lg mb-4 ${
                            isCorrect
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {isCorrect
                            ? `✅ ${type === 'multiple_choice' ? 'Correct' : 'Perfect'}! +${xpReward || 0} XP`
                            : `❌ Not quite. ${hint ? `Hint: ${hint}` : 'Try again!'}`}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <AnimatedButton variant="secondary" fullWidth onClick={onPrevious}>
                    ← Previous
                </AnimatedButton>
                {!showFeedback ? (
                    <AnimatedButton
                        variant="primary"
                        fullWidth
                        onClick={onCheckAnswer}
                        disabled={!canCheck}
                    >
                        Check Answer
                    </AnimatedButton>
                ) : isCorrect ? (
                    <AnimatedButton variant="primary" fullWidth onClick={onContinue}>
                        Continue →
                    </AnimatedButton>
                ) : (
                    <AnimatedButton variant="primary" fullWidth onClick={onTryAgain}>
                        Try Again
                    </AnimatedButton>
                )}
            </div>
        </motion.div>
    )
}
