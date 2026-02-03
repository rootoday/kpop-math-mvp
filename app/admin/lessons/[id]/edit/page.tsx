import { getLesson } from '../../actions'
import LessonForm from '../../new/LessonForm'
import { redirect } from 'next/navigation'

interface EditLessonPageProps {
    params: {
        id: string
    }
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
    const { id } = params
    const { data: lesson, error } = await getLesson(id)

    if (error || !lesson) {
        redirect('/admin/lessons')
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-bold">Edit Lesson</h2>
                <p className="text-gray-500 mt-2">Modify the lesson details and tier content below.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-kpop-purple/10">
                <LessonForm
                    lessonId={id}
                    initialData={{
                        title: lesson.title,
                        artist: lesson.artist,
                        math_concept: lesson.math_concept,
                        difficulty: lesson.difficulty as any,
                        tier_content: lesson.tier_content as any
                    }}
                />
            </div>
        </div>
    )
}
