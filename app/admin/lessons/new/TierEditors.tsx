'use client'

import React from 'react'

interface Tier1EditorProps {
    data: any
    onChange: (data: any) => void
}

export function Tier1Editor({ data, onChange }: Tier1EditorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ ...data, [e.target.name]: e.target.value })
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-kpop-purple border-b pb-2">Tier 1: Lesson Introduction</h3>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Intro Title</label>
                    <input
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        className="input-field mt-1"
                        placeholder="e.g. Welcome to Algebra!"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Intro Text</label>
                    <textarea
                        name="text"
                        value={data.text}
                        onChange={handleChange}
                        rows={4}
                        className="input-field mt-1"
                        placeholder="Explain what the student will learn..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        name="imageUrl"
                        value={data.imageUrl}
                        onChange={handleChange}
                        className="input-field mt-1"
                        placeholder="https://..."
                    />
                </div>
            </div>
        </div>
    )
}

interface Tier2EditorProps {
    data: any
    onChange: (data: any) => void
}

export function Tier2Editor({ data, onChange }: Tier2EditorProps) {
    const addStep = () => {
        const nextStep = (data.steps?.length || 0) + 1
        const newSteps = [...(data.steps || []), { stepNumber: nextStep, text: '', animation: 'fade-in' }]
        onChange({ ...data, steps: newSteps })
    }

    const removeStep = (index: number) => {
        const newSteps = data.steps.filter((_: any, i: number) => i !== index)
            .map((s: any, i: number) => ({ ...s, stepNumber: i + 1 }))
        onChange({ ...data, steps: newSteps })
    }

    const updateStep = (index: number, field: string, value: string) => {
        const newSteps = [...data.steps]
        newSteps[index] = { ...newSteps[index], [field]: value }
        onChange({ ...data, steps: newSteps })
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-music-green border-b pb-2">Tier 2: Learning Steps</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                    value={data.title}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Step-by-Step Breakdown"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Steps</label>
                {data.steps.map((step: any, index: number) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                        <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            Remove
                        </button>
                        <div className="grid gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase">Step {step.stepNumber}</span>
                            <textarea
                                value={step.text}
                                onChange={(e) => updateStep(index, 'text', e.target.value)}
                                className="input-field bg-white"
                                placeholder="Learning content for this step..."
                                rows={2}
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Animation</label>
                                    <select
                                        value={step.animation}
                                        onChange={(e) => updateStep(index, 'animation', e.target.value)}
                                        className="input-field bg-white py-1 text-sm"
                                    >
                                        <option value="fade-in">Fade In</option>
                                        <option value="slide-up">Slide Up</option>
                                        <option value="scale-in">Scale In</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addStep}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-music-green hover:text-music-green transition-all"
                >
                    + Add Step
                </button>
            </div>
        </div>
    )
}

interface Tier3EditorProps {
    data: any
    onChange: (data: any) => void
}

export function Tier3Editor({ data, onChange }: Tier3EditorProps) {
    const updateOption = (index: number, text: string) => {
        const newOptions = [...data.options]
        newOptions[index] = { ...newOptions[index], text }
        onChange({ ...data, options: newOptions })
    }

    const setCorrect = (index: number) => {
        const newOptions = data.options.map((opt: any, i: number) => ({
            ...opt,
            isCorrect: i === index
        }))
        onChange({ ...data, options: newOptions })
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-kpop-red border-b pb-2">Tier 3: Multiple Choice Quiz</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea
                    value={data.questionText}
                    onChange={(e) => onChange({ ...data, questionText: e.target.value })}
                    className="input-field mt-1"
                    rows={2}
                    placeholder="Ask something about the lesson..."
                />
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Options (Select the correct one)</label>
                {data.options.map((opt: any, index: number) => (
                    <div key={opt.id} className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="correct-option"
                            checked={opt.isCorrect}
                            onChange={() => setCorrect(index)}
                            className="w-4 h-4 text-kpop-red focus:ring-kpop-red"
                        />
                        <input
                            value={opt.text}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className={`flex-1 input-field py-2 ${opt.isCorrect ? 'border-kpop-red ring-1 ring-kpop-red' : ''}`}
                            placeholder={`Option ${opt.id.toUpperCase()}...`}
                        />
                    </div>
                ))}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Hint (Optional)</label>
                <input
                    value={data.hint || ''}
                    onChange={(e) => onChange({ ...data, hint: e.target.value })}
                    className="input-field mt-1"
                    placeholder="A small clue..."
                />
            </div>
        </div>
    )
}

interface Tier4EditorProps {
    data: any
    onChange: (data: any) => void
}

export function Tier4Editor({ data, onChange }: Tier4EditorProps) {
    const handleAcceptableAnswersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const answers = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
        onChange({ ...data, acceptableAnswers: answers })
    }

    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-kpop-purple border-b pb-2">Tier 4: Fill in the Blank</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea
                    value={data.questionText}
                    onChange={(e) => onChange({ ...data, questionText: e.target.value })}
                    className="input-field mt-1"
                    rows={2}
                    placeholder="Ask a question where the student types the answer..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Primary Correct Answer</label>
                <input
                    value={data.correctAnswer}
                    onChange={(e) => onChange({ ...data, correctAnswer: e.target.value })}
                    className="input-field mt-1 font-bold text-center"
                    placeholder="The exact answer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Other Acceptable Answers (comma separated)</label>
                <input
                    value={data.acceptableAnswers?.join(', ') || ''}
                    onChange={handleAcceptableAnswersChange}
                    className="input-field mt-1"
                    placeholder="ans1, ans2, ans3..."
                />
            </div>
        </div>
    )
}

interface Tier5EditorProps {
    data: any
    onChange: (data: any) => void
}

export function Tier5Editor({ data, onChange }: Tier5EditorProps) {
    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-yellow-500 border-b pb-2">Tier 5: Completion & Rewards</h3>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Congratulations Title</label>
                    <input
                        value={data.congratsText}
                        onChange={(e) => onChange({ ...data, congratsText: e.target.value })}
                        className="input-field mt-1 text-music-green font-bold"
                        placeholder="e.g. Great Job!"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Summary Message</label>
                    <textarea
                        value={data.summaryText}
                        onChange={(e) => onChange({ ...data, summaryText: e.target.value })}
                        rows={3}
                        className="input-field mt-1"
                        placeholder="Encouraging summary..."
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">XP Reward</label>
                        <input
                            type="number"
                            value={data.totalXpReward}
                            onChange={(e) => onChange({ ...data, totalXpReward: parseInt(e.target.value) || 0 })}
                            className="input-field mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Badge Key</label>
                        <input
                            value={data.badgeEarned || ''}
                            onChange={(e) => onChange({ ...data, badgeEarned: e.target.value || null })}
                            className="input-field mt-1"
                            placeholder="e.g. algebra-master"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
