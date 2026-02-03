import LessonForm from './LessonForm'

export default function NewLessonPage() {
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Create New Lesson</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <LessonForm />
            </div>
        </div>
    )
}
