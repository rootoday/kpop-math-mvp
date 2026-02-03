import { createServerClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import LessonClient from './LessonClient'

export default async function LessonPage({ params }: { params: { id: string } }) {
    const supabase = createServerClient()

    // Check authentication
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
        redirect('/login')
    }

    // Fetch user profile
    const userData = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

    if (!userData.data) { // Standardizing on data check since we casted to any
        redirect('/login')
    }

    // Fetch lesson data
    const { data: lesson, error: lessonError } = await (supabase as any)
        .from('lessons')
        .select('*')
        .eq('id', params.id)
        .single()

    if (lessonError || !lesson) {
        notFound()
    }

    // Fetch user progress
    const { data: userProgress } = await (supabase as any)
        .from('user_progress')
        .select('*')
        .eq('lesson_id', params.id)
        .eq('user_id', authUser.id)
        .maybeSingle()

    return (
        <div className="container mx-auto px-4 py-8">
            <LessonClient
                lesson={lesson}
                initialProgress={userProgress || null}
                user={userData.data}
            />
        </div>
    )
}
