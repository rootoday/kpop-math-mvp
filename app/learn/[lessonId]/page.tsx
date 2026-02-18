import { createServerClient } from '@/lib/supabase/server'
import { getLessonById } from '@/lib/supabase/lessons'
import { notFound, redirect } from 'next/navigation'
import LessonPlayer from './LessonPlayer'

export default async function LearnPage({ params }: { params: { lessonId: string } }) {
    const supabase = createServerClient()

    // Auth check
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: userData } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

    if (!userData) {
        redirect('/login')
    }

    // Fetch lesson
    const lesson = await getLessonById(supabase as any, params.lessonId)
    if (!lesson || !lesson.is_published) {
        notFound()
    }

    // Fetch user progress for this lesson
    const { data: userProgress } = await (supabase as any)
        .from('user_progress')
        .select('*')
        .eq('lesson_id', params.lessonId)
        .eq('user_id', authUser.id)
        .maybeSingle()

    return (
        <LessonPlayer
            lesson={lesson}
            initialProgress={userProgress || null}
            user={userData}
        />
    )
}
