import { createServerClient, getCachedLessons, getCachedUserProgress, getCachedUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User } from '@/types'
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

    const fallbackUser: User = {
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || 'Student',
        last_name: user.user_metadata?.last_name || '',
        xp_points: 0,
        current_streak: 0,
        badges: [],
        completed_lessons: [],
        role: 'user',
        is_beta_tester: false,
        beta_enrolled_at: null,
        last_login_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    return (
        <DashboardClient
            lessons={lessons || []}
            progress={userProgress || []}
            user={userData || fallbackUser}
        />
    )
}
