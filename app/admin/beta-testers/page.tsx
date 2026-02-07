'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

type User = Database['public']['Tables']['users']['Row']

export default function BetaTestersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'beta' | 'non-beta'>('all')

    const supabase = createClientComponentClient<Database>()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await (supabase as any)
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
        } else {
            setUsers(data || [])
        }
        setLoading(false)
    }

    const toggleBetaTester = async (userId: string, currentStatus: boolean) => {
        setUpdating(userId)
        const { error } = await (supabase as any)
            .from('users')
            .update({ is_beta_tester: !currentStatus })
            .eq('id', userId)

        if (error) {
            console.error('Error updating beta status:', error)
        } else {
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, is_beta_tester: !currentStatus }
                        : user
                )
            )
        }
        setUpdating(null)
    }

    const filteredUsers = users.filter(user => {
        if (filter === 'beta') return user.is_beta_tester
        if (filter === 'non-beta') return !user.is_beta_tester
        return true
    })

    const betaCount = users.filter(u => u.is_beta_tester).length

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading users...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Beta Testers</h1>
                    <p className="text-gray-600">
                        {betaCount} of {users.length} users are beta testers
                    </p>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2">
                    {(['all', 'beta', 'non-beta'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                ${filter === f
                                    ? 'bg-kpop-purple text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f === 'all' ? 'All' : f === 'beta' ? 'Beta Testers' : 'Non-Beta'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card bg-gradient-to-br from-purple-50 to-white">
                    <div className="text-3xl font-bold text-kpop-purple">{users.length}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                </div>
                <div className="card bg-gradient-to-br from-green-50 to-white">
                    <div className="text-3xl font-bold text-music-green">{betaCount}</div>
                    <div className="text-sm text-gray-500">Beta Testers</div>
                </div>
                <div className="card bg-gradient-to-br from-gray-50 to-white">
                    <div className="text-3xl font-bold text-gray-600">{users.length - betaCount}</div>
                    <div className="text-sm text-gray-500">Regular Users</div>
                </div>
            </div>

            {/* Users table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">XP</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Beta Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {user.first_name || user.last_name
                                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                            : 'No name'
                                        }
                                    </div>
                                    <div className="text-xs text-gray-400">{user.id.slice(0, 8)}...</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                <td className="px-4 py-3">
                                    <span className="text-sm font-medium text-kpop-purple">
                                        {user.xp_points} XP
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`badge text-xs ${
                                        user.role === 'admin' ? 'badge-advanced' : 'badge-beginner'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => toggleBetaTester(user.id, user.is_beta_tester)}
                                        disabled={updating === user.id}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                                            ${updating === user.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                                            ${user.is_beta_tester
                                                ? 'bg-music-green text-white hover:bg-green-600'
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        {updating === user.id
                                            ? '...'
                                            : user.is_beta_tester ? 'Beta Tester' : 'Make Beta'
                                        }
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                        No users found with this filter
                    </div>
                )}
            </div>
        </div>
    )
}
