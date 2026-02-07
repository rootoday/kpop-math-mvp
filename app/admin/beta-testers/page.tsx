'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type UserRow = Database['public']['Tables']['users']['Row']

interface BetaTesterStats extends UserRow {
    progress_count: number
}

export default function BetaTestersPage() {
    const [users, setUsers] = useState<BetaTesterStats[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch all users
            const { data: usersData, error: usersError } = await supabase
                .from<'users', UserRow>('users')
                .select('*')
                .order('created_at', { ascending: false })

            if (usersError) throw usersError

            // For now, set progress_count to 0 for all users
            // TODO: Fetch from lesson_progress table once types are stable
            const enrichedUsers = (usersData || []).map(user => ({
                ...user,
                progress_count: 0
            }))

            setUsers(enrichedUsers)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleBetaStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    is_beta_tester: !currentStatus,
                    beta_enrolled_at: !currentStatus ? new Date().toISOString() : null
                } as any)
                .eq('id', userId)

            if (error) throw error

            // Refresh the list
            await fetchUsers()
        } catch (err: any) {
            alert(`Failed to update beta status: ${err.message}`)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const betaCount = users.filter(u => u.is_beta_tester).length
    const totalCount = users.length

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Beta Tester Management</h1>
                    <p className="text-gray-600">
                        Manage user access to the beta program. {betaCount} of {totalCount} users enrolled.
                    </p>
                </div>

                {/* Search & Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="w-full md:w-96">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Search Users
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search by email or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpop-purple focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-8 h-8 border-4 border-kpop-purple border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* User List */}
                {!loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Beta Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Progress
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                {searchTerm ? 'No users match your search.' : 'No users found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kpop-purple to-kpop-pink flex items-center justify-center text-white font-bold">
                                                            {user.first_name?.[0] || user.email[0].toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.role === 'admin' && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                        Admin
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.is_beta_tester ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            ✓ Beta Tester
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Regular User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{user.completed_lessons?.length || 0}</span>
                                                        <span className="text-gray-500">completed</span>
                                                        {user.progress_count > 0 && (
                                                            <span className="text-xs text-gray-400">
                                                                ({user.progress_count} in progress)
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.last_login_date
                                                        ? new Date(user.last_login_date).toLocaleDateString()
                                                        : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => toggleBetaStatus(user.id, user.is_beta_tester)}
                                                        className={`px-3 py-1 rounded-md font-medium transition-colors ${user.is_beta_tester
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                    >
                                                        {user.is_beta_tester ? 'Revoke Beta' : 'Grant Beta'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
