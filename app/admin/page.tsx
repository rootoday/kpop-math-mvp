import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage() {
    const supabase = createServerClient()

    // Fetch stats
    const { count: userCount } = await (supabase as any)
        .from('users')
        .select('*', { count: 'exact', head: true })

    const { count: lessonCount } = await (supabase as any)
        .from('lessons')
        .select('*', { count: 'exact', head: true })

    const { data: usersData } = await (supabase as any)
        .from('users')
        .select('xp_points')

    const totalXp = (usersData as any[])?.reduce((sum, u) => sum + (u.xp_points || 0), 0) || 0

    const stats = [
        {
            label: 'Total Users',
            value: userCount,
            accent: 'border-kpop-purple',
            iconBg: 'bg-kpop-purple/10',
            iconColor: 'text-kpop-purple',
        },
        {
            label: 'Total Lessons',
            value: lessonCount,
            accent: 'border-music-green',
            iconBg: 'bg-music-green/10',
            iconColor: 'text-music-green',
        },
        {
            label: 'Total XP Points',
            value: totalXp.toLocaleString(),
            accent: 'border-kpop-red',
            iconBg: 'bg-kpop-red/10',
            iconColor: 'text-kpop-red',
        },
    ]

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-heading mb-8">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`card-gradient border-t-4 ${stat.accent} hover:shadow-xl transition-all duration-300`}
                    >
                        <h3 className="text-gray-500 text-sm font-semibold uppercase">{stat.label}</h3>
                        <p className="text-4xl font-heading mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <Link href="/admin/lessons/new" className="btn-primary">
                        Add New Lesson
                    </Link>
                    <button className="btn-secondary">Export User Data</button>
                </div>
            </div>
        </div>
    )
}
