import { createServerClient } from '@/lib/supabase/server'
import { getLessonById } from '@/lib/supabase/lessons'
import { notFound, redirect } from 'next/navigation'
import LessonPlayer from './LessonPlayer'

export default async function LearnPage({ params }: { params: { lessonId: string } }) {
    const supabase = createServerClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch lesson
    const lesson = await getLessonById(supabase as any, params.lessonId)
    if (!lesson || !lesson.is_published) {
        notFound()
    }

    return <LessonPlayer lesson={lesson} />
}
