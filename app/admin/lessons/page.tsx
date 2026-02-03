import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLessonsPage() {
    const supabase = createServerClient()
    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div>Error loading lessons: {error.message}</div>
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Manage Lessons</h2>
                <Link href="/admin/lessons/new" className="btn-primary">
                    Create New Lesson
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Artist</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Title</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Concept</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Difficulty</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {(lessons as any[])?.map((lesson) => (
                            <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-kpop-purple">{lesson.artist}</td>
                                <td className="px-6 py-4 text-gray-800">{lesson.title}</td>
                                <td className="px-6 py-4 text-gray-600">{lesson.math_concept}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                        lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {lesson.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button className="text-kpop-purple hover:underline mr-4">Edit</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
