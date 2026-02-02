import { createServerClient, getCachedLessons, getCachedUserProgress, getCachedUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour

export default async function DashboardPage() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Parallel data fetching
    const [lessons, userProgress, userData] = await Promise.all([
        getCachedLessons(),
        getCachedUserProgress(user.id),
        getCachedUser(user.id),
    ])

    return (
        <DashboardClient
            lessons={lessons || []}
            progress={userProgress || []}
            user={userData}
        />
    )
}
