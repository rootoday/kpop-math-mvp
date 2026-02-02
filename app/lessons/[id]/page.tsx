import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import LessonClient from './LessonClient'

export default async function LessonPage({ params }: { params: { id: string } }) {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch lesson data
    const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.id)
        .single()

    if (lessonError || !lesson) {
        notFound()
    }

    // Fetch user progress
    const { data: userProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', params.id)
        .single()

    // Fetch user data
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <LessonClient
            lesson={lesson}
            initialProgress={userProgress}
            user={userData!}
        />
    )
}
