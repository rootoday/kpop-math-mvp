import { createServerClient } from '@/lib/supabase/server'
import MathConceptsManager from './MathConceptsManager'
import type { MathConcept } from '@/types'

export default async function MathConceptsPage() {
    const supabase = createServerClient()

    const { data } = await (supabase as any)
        .from('math_concepts')
        .select('*')
        .order('name', { ascending: true })

    const concepts: MathConcept[] = data || []

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-heading">Math Concepts</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {concepts.length} concept{concepts.length !== 1 ? 's' : ''} registered
                    </p>
                </div>
            </div>
            <MathConceptsManager initialConcepts={concepts} />
        </div>
    )
}
