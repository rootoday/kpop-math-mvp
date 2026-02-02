import { createServerClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
    const supabase = createServerClient()
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('xp_points', { ascending: false })

    if (error) {
        return <div>Error loading users: {error.message}</div>
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Manage Users</h2>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Name</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Email</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">XP Points</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Streak</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Role</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {(users as any[])?.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.first_name} {user.last_name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 font-bold text-music-green">{user.xp_points.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">{user.current_streak} 🔥</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button className="text-kpop-purple hover:underline mr-4">Edit Profile</button>
                                    {user.role !== 'admin' && (
                                        <button className="text-music-green hover:underline">Promote to Admin</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
