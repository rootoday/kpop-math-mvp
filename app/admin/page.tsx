import { createServerClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
    const supabase = createServerClient()

    // Fetch stats
    const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    const { count: lessonCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })

    const { data: usersData } = await supabase
        .from('users')
        .select('xp_points')

    const totalXp = usersData?.reduce((sum, u) => sum + (u.xp_points || 0), 0) || 0

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-white p-6 shadow-sm border-l-4 border-kpop-purple">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Users</h3>
                    <p className="text-4xl font-bold mt-2">{userCount}</p>
                </div>

                <div className="card bg-white p-6 shadow-sm border-l-4 border-music-green">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Lessons</h3>
                    <p className="text-4xl font-bold mt-2">{lessonCount}</p>
                </div>

                <div className="card bg-white p-6 shadow-sm border-l-4 border-kpop-red">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Total XP Points</h3>
                    <p className="text-4xl font-bold mt-2">{totalXp.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button className="btn-primary">Add New Lesson</button>
                    <button className="btn-secondary">Export User Data</button>
                </div>
            </div>
        </div>
    )
}
