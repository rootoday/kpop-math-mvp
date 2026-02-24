'use client'

import { useState } from 'react'
import type { MathConcept } from '@/types'
import {
    createMathConceptAction,
    updateMathConceptAction,
    deleteMathConceptAction,
} from './actions'

const CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'arithmetic', label: 'Arithmetic' },
    { value: 'algebra', label: 'Algebra' },
    { value: 'geometry', label: 'Geometry' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'calculus', label: 'Calculus' },
    { value: 'number-theory', label: 'Number Theory' },
]

interface MathConceptsManagerProps {
    initialConcepts: MathConcept[]
}

export default function MathConceptsManager({ initialConcepts }: MathConceptsManagerProps) {
    const [concepts, setConcepts] = useState(initialConcepts)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [showInactive, setShowInactive] = useState(false)

    // Add form state
    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newCategory, setNewCategory] = useState('general')

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editCategory, setEditCategory] = useState('general')

    // Delete confirmation
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Feedback
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 4000)
    }

    const filteredConcepts = concepts.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter
        const matchesActive = showInactive || c.is_active
        return matchesSearch && matchesCategory && matchesActive
    })

    const handleAdd = async () => {
        if (!newName.trim()) return
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append('name', newName)
        formData.append('description', newDescription)
        formData.append('category', newCategory)

        const result = await createMathConceptAction(formData)

        if (result.error) {
            showToast('error', result.error)
        } else {
            // Optimistic: add to local list
            const newConcept: MathConcept = {
                id: crypto.randomUUID(),
                name: newName.trim(),
                description: newDescription.trim(),
                category: newCategory,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            setConcepts(prev => [...prev, newConcept].sort((a, b) => a.name.localeCompare(b.name)))
            setNewName('')
            setNewDescription('')
            setNewCategory('general')
            setIsAdding(false)
            showToast('success', `"${newName.trim()}" added`)
        }

        setIsSubmitting(false)
    }

    const handleStartEdit = (concept: MathConcept) => {
        setEditingId(concept.id)
        setEditName(concept.name)
        setEditDescription(concept.description)
        setEditCategory(concept.category)
    }

    const handleSaveEdit = async (id: string) => {
        if (!editName.trim()) return
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append('name', editName)
        formData.append('description', editDescription)
        formData.append('category', editCategory)
        const concept = concepts.find(c => c.id === id)
        formData.append('is_active', String(concept?.is_active ?? true))

        const result = await updateMathConceptAction(id, formData)

        if (result.error) {
            showToast('error', result.error)
        } else {
            setConcepts(prev =>
                prev.map(c =>
                    c.id === id
                        ? { ...c, name: editName.trim(), description: editDescription.trim(), category: editCategory }
                        : c
                ).sort((a, b) => a.name.localeCompare(b.name))
            )
            setEditingId(null)
            showToast('success', 'Concept updated')
        }

        setIsSubmitting(false)
    }

    const handleToggleActive = async (concept: MathConcept) => {
        const formData = new FormData()
        formData.append('name', concept.name)
        formData.append('description', concept.description)
        formData.append('category', concept.category)
        formData.append('is_active', String(!concept.is_active))

        const result = await updateMathConceptAction(concept.id, formData)

        if (result.error) {
            showToast('error', result.error)
        } else {
            setConcepts(prev =>
                prev.map(c => c.id === concept.id ? { ...c, is_active: !c.is_active } : c)
            )
            showToast('success', concept.is_active ? 'Concept deactivated' : 'Concept activated')
        }
    }

    const handleDelete = async (id: string) => {
        const concept = concepts.find(c => c.id === id)
        const result = await deleteMathConceptAction(id)

        if (result.error) {
            showToast('error', result.error)
        } else {
            setConcepts(prev => prev.filter(c => c.id !== id))
            showToast('success', `"${concept?.name}" deleted`)
        }
        setDeletingId(null)
    }

    const uniqueCategories = Array.from(new Set(concepts.map(c => c.category))).sort()

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search concepts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpop-purple/40 focus:border-kpop-purple transition-all text-sm"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kpop-purple/40"
                >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={showInactive}
                        onChange={(e) => setShowInactive(e.target.checked)}
                        className="w-4 h-4 text-kpop-purple rounded border-gray-300 focus:ring-kpop-purple"
                    />
                    Show inactive
                </label>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary whitespace-nowrap"
                >
                    + Add Concept
                </button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-white rounded-xl shadow-sm border border-kpop-purple/20 p-6 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">New Math Concept</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                                placeholder="e.g. Linear Equations"
                                className="input-field w-full"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="input-field w-full"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                                placeholder="Brief description..."
                                className="input-field w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleAdd}
                            disabled={isSubmitting || !newName.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Concept'}
                        </button>
                        <button
                            onClick={() => { setIsAdding(false); setNewName(''); setNewDescription(''); setNewCategory('general') }}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Concepts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Description</th>
                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
                            <th className="text-center px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConcepts.map((concept) => (
                            <tr key={concept.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!concept.is_active ? 'opacity-50' : ''}`}>
                                {editingId === concept.id ? (
                                    <>
                                        <td className="px-6 py-3">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(concept.id); if (e.key === 'Escape') setEditingId(null) }}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-kpop-purple/40"
                                                autoFocus
                                            />
                                        </td>
                                        <td className="px-6 py-3 hidden md:table-cell">
                                            <input
                                                type="text"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(concept.id); if (e.key === 'Escape') setEditingId(null) }}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-kpop-purple/40"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <select
                                                value={editCategory}
                                                onChange={(e) => setEditCategory(e.target.value)}
                                                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-kpop-purple/40"
                                            >
                                                {CATEGORIES.map(c => (
                                                    <option key={c.value} value={c.value}>{c.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${concept.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {concept.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex gap-1 justify-end">
                                                <button
                                                    onClick={() => handleSaveEdit(concept.id)}
                                                    disabled={isSubmitting || !editName.trim()}
                                                    className="px-3 py-1 text-xs font-bold text-white bg-music-green rounded-lg hover:bg-music-green/90 transition-colors disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : deletingId === concept.id ? (
                                    <>
                                        <td colSpan={4} className="px-6 py-3">
                                            <span className="text-sm text-red-600 font-medium">
                                                Delete &quot;{concept.name}&quot;?
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex gap-1 justify-end">
                                                <button
                                                    onClick={() => handleDelete(concept.id)}
                                                    className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(null)}
                                                    className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-3">
                                            <span className="text-sm font-medium text-gray-900">{concept.name}</span>
                                        </td>
                                        <td className="px-6 py-3 hidden md:table-cell">
                                            <span className="text-sm text-gray-500 line-clamp-1">{concept.description || '-'}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium capitalize">
                                                {concept.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => handleToggleActive(concept)}
                                                className={`px-2 py-0.5 text-[10px] rounded-full font-bold cursor-pointer transition-colors ${concept.is_active
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {concept.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex gap-1 justify-end">
                                                <button
                                                    onClick={() => handleStartEdit(concept)}
                                                    className="p-1.5 text-gray-400 hover:text-kpop-purple hover:bg-kpop-purple/5 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(concept.id)}
                                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredConcepts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">No concepts found</h3>
                        <p className="text-xs text-gray-500">
                            {searchTerm ? `No results for "${searchTerm}"` : 'Add your first math concept.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] animate-fade-in">
                    <div
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-kpop border ${
                            toast.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
