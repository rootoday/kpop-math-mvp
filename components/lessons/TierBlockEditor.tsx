'use client'

import React, { useState } from 'react'
import type { BaseTier } from '@/types/database.types'

interface TierBlockEditorProps<T extends BaseTier> {
    tierNumber: 1 | 2 | 3 | 4 | 5
    data: T
    onChange: (data: T) => void
    children: React.ReactNode
    isDefaultOpen?: boolean
}

export default function TierBlockEditor<T extends BaseTier>({
    tierNumber,
    data,
    onChange,
    children,
    isDefaultOpen = false
}: TierBlockEditorProps<T>) {
    const [isOpen, setIsOpen] = useState(isDefaultOpen)

    const handleChange = (field: keyof BaseTier, value: any) => {
        onChange({
            ...data,
            [field]: value
        })
    }

    const isComplete = data.title && data.shortDescription && data.estimatedMinutes > 0

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 transition-all">
            {/* Header / Toggle */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isOpen ? 'border-b border-gray-100' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {tierNumber}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">
                            {data.title || `Tier ${tierNumber}`}
                        </span>
                        <span className="text-xs text-gray-500 line-clamp-1">
                            {data.shortDescription || 'No description provided'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isComplete ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                        {isComplete ? 'Ready' : 'Draft'}
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Body */}
            {isOpen && (
                <div className="p-6 bg-gray-50/50 animate-fade-in">
                    {/* Common Metadata Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                            <input
                                type="text"
                                value={data.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-kpop-purple/20 focus:border-kpop-purple transition-all"
                                placeholder={`e.g. Tier ${tierNumber} Introduction`}
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Short Description</label>
                            <input
                                type="text"
                                value={data.shortDescription || ''}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-kpop-purple/20 transition-all"
                                placeholder="Brief overview..."
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Est. Minutes</label>
                            <input
                                type="number"
                                min="1"
                                value={data.estimatedMinutes || ''}
                                onChange={(e) => handleChange('estimatedMinutes', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-kpop-purple/20 transition-all"
                                placeholder="5"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Learning Objective</label>
                            <input
                                type="text"
                                value={data.learningObjective || ''}
                                onChange={(e) => handleChange('learningObjective', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-kpop-purple/20 transition-all"
                                placeholder="Student will differenciate between..."
                            />
                        </div>
                    </div>

                    {/* Specific Content Slot */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interactive Content</label>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}
