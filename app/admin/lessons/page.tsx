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
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    Lesson Management
                </h2>
                <div className="text-sm text-gray-500 font-medium">
                    {(lessons as any[]).length} Total Lessons
                </div>
            </div>

            <LessonManager initialLessons={lessons as any[]} />
        </div>
    )
}
