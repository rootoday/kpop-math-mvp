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

    const userData = await getCachedUser(authUser.id)

    if (!userData || (userData as any).role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-kpop-purple text-white hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <Link href="/admin" className="block px-6 py-3 hover:bg-white/10 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/lessons" className="block px-6 py-3 hover:bg-white/10 transition-colors">
                        Manage Lessons
                    </Link>
                    <Link href="/admin/users" className="block px-6 py-3 hover:bg-white/10 transition-colors">
                        Manage Users
                    </Link>
                    <div className="mt-auto pt-6 border-t border-white/20">
                        <Link href="/dashboard" className="block px-6 py-3 hover:bg-white/10 transition-colors">
                            Back to App
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden bg-kpop-purple text-white p-4 flex justify-between items-center">
                    <h1 className="text-lg font-bold">Admin Panel</h1>
                    {/* Add hamburger menu here if needed */}
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
