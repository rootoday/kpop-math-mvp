import { createServerClient } from '@/lib/supabase/server'
import LessonManager from './LessonManager'
import type { Database } from '@/types/database.types'

export default async function AdminLessonsPage() {
    const supabase = createServerClient()
    const { data: lessons, error } = await (supabase as any)
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div>Error loading lessons: {error.message}</div>
    }

    return (
        <div className="animate-fade-in h-[calc(100vh-100px)]">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl font-heading text-gradient">
                    Lesson Management
                </h2>
                <div className="text-sm text-gray-500 font-medium bg-kpop-purple/5 px-3 py-1.5 rounded-full">
                    {(lessons as any[]).length} Total Lessons
                </div>
            </div>

            <LessonManager initialLessons={lessons as any[]} />
        </div>
    )
}
