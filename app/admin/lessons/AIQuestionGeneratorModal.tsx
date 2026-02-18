'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useAIQuestionGenerator } from '@/lib/hooks/useAIQuestionGenerator'
import type { AIQuestion } from '@/types/ai'

const TOPICS = [
    { value: 'percentages', label: 'Percentages' },
    { value: 'fractions', label: 'Fractions' },
    { value: 'ratios', label: 'Ratios' },
    { value: 'algebra', label: 'Algebra' },
    { value: 'geometry', label: 'Geometry' },
    { value: 'statistics', label: 'Statistics' },
]

const DEFAULT_ARTISTS = [
    { value: 'NewJeans', label: 'NewJeans' },
    { value: 'BTS', label: 'BTS' },
    { value: 'BLACKPINK', label: 'BLACKPINK' },
    { value: 'aespa', label: 'aespa' },
    { value: 'TWICE', label: 'TWICE' },
    { value: 'Stray Kids', label: 'Stray Kids' },
    { value: 'IVE', label: 'IVE' },
    { value: 'LE SSERAFIM', label: 'LE SSERAFIM' },
]

const DIFFICULTY_LABELS = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard']

const TIER_OPTIONS = [
    { value: 3, label: 'Tier 3 — Multiple Choice Quiz' },
    { value: 4, label: 'Tier 4 — Fill in the Blank Challenge' },
]

interface AIQuestionGeneratorModalProps {
    isOpen: boolean
    onClose: () => void
    onAddToLesson: (question: AIQuestion, tier: number) => void
}

export default function AIQuestionGeneratorModal({
    isOpen,
    onClose,
    onAddToLesson,
}: AIQuestionGeneratorModalProps) {
    const [topic, setTopic] = useState(TOPICS[0].value)
    const [difficulty, setDifficulty] = useState(3)
    const [tier, setTier] = useState(3)
    const [artists, setArtists] = useState(DEFAULT_ARTISTS)
    const [artistName, setArtistName] = useState(DEFAULT_ARTISTS[0].value)
    const [newArtist, setNewArtist] = useState('')
    const { loading, error, data: result, generateQuestion, reset } = useAIQuestionGenerator()

    if (!isOpen) return null

    const handleGenerate = () => {
        generateQuestion({ topic, difficulty, artistName, tier })
    }

    const handleAddToLesson = () => {
        if (result) {
            onAddToLesson(result, tier)
            handleClose()
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fade-in max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kpop-purple to-kpop-red flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">AI Question Generator</h3>
                            <p className="text-xs text-gray-500">Powered by Claude</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    {/* Topic */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Math Concept</label>
                        <select
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="input-field w-full"
                            disabled={loading}
                        >
                            {TOPICS.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Tier</label>
                        <select
                            value={tier}
                            onChange={(e) => setTier(Number(e.target.value))}
                            className="input-field w-full"
                            disabled={loading}
                        >
                            {TIER_OPTIONS.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Slider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Difficulty: <span className="text-kpop-purple font-bold">{DIFFICULTY_LABELS[difficulty]}</span>
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={difficulty}
                            onChange={(e) => setDifficulty(Number(e.target.value))}
                            disabled={loading}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kpop-purple"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <span key={n}>{n}</span>
                            ))}
                        </div>
                    </div>

                    {/* Artist */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Artist</label>
                        <select
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            className="input-field w-full"
                            disabled={loading}
                        >
                            {artists.map((a) => (
                                <option key={a.value} value={a.value}>{a.label}</option>
                            ))}
                        </select>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={newArtist}
                                onChange={(e) => setNewArtist(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const trimmed = newArtist.trim()
                                        if (trimmed && !artists.some(a => a.value.toLowerCase() === trimmed.toLowerCase())) {
                                            setArtists(prev => [...prev, { value: trimmed, label: trimmed }])
                                            setArtistName(trimmed)
                                            setNewArtist('')
                                        }
                                    }
                                }}
                                placeholder="Add new artist..."
                                disabled={loading}
                                className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpop-purple/20 transition-all"
                            />
                            <button
                                type="button"
                                disabled={loading || !newArtist.trim()}
                                onClick={() => {
                                    const trimmed = newArtist.trim()
                                    if (trimmed && !artists.some(a => a.value.toLowerCase() === trimmed.toLowerCase())) {
                                        setArtists(prev => [...prev, { value: trimmed, label: trimmed }])
                                        setArtistName(trimmed)
                                        setNewArtist('')
                                    }
                                }}
                                className="px-3 py-1.5 bg-kpop-purple text-white text-sm font-bold rounded-lg hover:bg-kpop-purple/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate Question
                            </>
                        )}
                    </button>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gradient-to-r from-kpop-purple/10 to-transparent border-b border-gray-200">
                                <h4 className="text-sm font-bold text-gray-800">Generated Question</h4>
                            </div>
                            <div className="p-4 space-y-4">
                                {/* Question */}
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Question</span>
                                    <p className="text-sm text-gray-800 mt-1">{result.question}</p>
                                </div>

                                {/* Choices (Tier 3 only) */}
                                {result.choices && result.choices.length > 0 && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 uppercase">Choices</span>
                                        <div className="mt-1 space-y-1.5">
                                            {result.choices.map((choice, i) => (
                                                <div
                                                    key={i}
                                                    className={`text-sm px-3 py-2 rounded-lg border ${
                                                        choice === result.correctAnswer
                                                            ? 'bg-green-50 border-green-300 text-green-800 font-medium'
                                                            : 'bg-white border-gray-200 text-gray-700'
                                                    }`}
                                                >
                                                    <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                                                    {choice}
                                                    {choice === result.correctAnswer && (
                                                        <span className="ml-2 text-green-600 text-xs">(Correct)</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Correct Answer (Tier 4 — fill in blank) */}
                                {(!result.choices || result.choices.length === 0) && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 uppercase">Correct Answer</span>
                                        <p className="text-sm font-bold text-green-700 mt-1 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                            {result.correctAnswer}
                                        </p>
                                    </div>
                                )}

                                {/* Explanation */}
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Explanation</span>
                                    <p className="text-sm text-gray-600 mt-1 bg-white p-3 rounded-lg border border-gray-200">
                                        {result.explanation}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Regenerate
                                    </button>
                                    <button
                                        onClick={handleAddToLesson}
                                        className="flex-1 py-2.5 bg-music-green text-white font-bold rounded-xl hover:bg-music-green/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add to Lesson
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
