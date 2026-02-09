import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, getCachedUser } from '@/lib/supabase/server'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createServerClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        redirect('/login')
    }

    const userData = await getCachedUser(authUser.id) as any

    if (!userData || userData.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 gradient-hero text-white hidden md:flex md:flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-heading">Admin Panel</h1>
                    <p className="text-white/60 text-xs mt-1">K-POP Math Management</p>
                </div>
                <nav className="mt-4 flex-1 px-3 space-y-1">
                    <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-white/15 transition-all duration-200 text-sm font-medium">
                        Dashboard
                    </Link>
                    <Link href="/admin/lessons" className="block px-4 py-3 rounded-lg hover:bg-white/15 transition-all duration-200 text-sm font-medium">
                        Manage Lessons
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-white/15 transition-all duration-200 text-sm font-medium">
                        Manage Users
                    </Link>
                </nav>
                <div className="p-3 border-t border-white/20">
                    <Link href="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-white/15 transition-all duration-200 text-sm font-medium opacity-80">
                        ← Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden gradient-hero text-white p-4 flex justify-between items-center">
                    <h1 className="text-lg font-heading">Admin Panel</h1>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
