import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { MathConcept } from '@/types'

/**
 * Fetch all active math concepts (sorted by name)
 */
export async function getMathConcepts(
    client: SupabaseClient<Database>
): Promise<MathConcept[]> {
    const { data, error } = await (client as any)
        .from('math_concepts')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching math concepts:', error)
        return []
    }

    return data as MathConcept[]
}

/**
 * Fetch all math concepts including inactive (for admin)
 */
export async function getAllMathConcepts(
    client: SupabaseClient<Database>
): Promise<MathConcept[]> {
    const { data, error } = await (client as any)
        .from('math_concepts')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching all math concepts:', error)
        return []
    }

    return data as MathConcept[]
}

/**
 * Create a new math concept
 */
export async function createMathConcept(
    client: SupabaseClient<Database>,
    concept: { name: string; description?: string; category?: string }
): Promise<{ data: MathConcept | null; error: string | null }> {
    const { data, error } = await (client as any)
        .from('math_concepts')
        .insert({
            name: concept.name,
            description: concept.description || '',
            category: concept.category || 'general',
        })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            return { data: null, error: 'A concept with this name already exists.' }
        }
        console.error('Error creating math concept:', error)
        return { data: null, error: error.message }
    }

    return { data: data as MathConcept, error: null }
}

/**
 * Update an existing math concept
 */
export async function updateMathConcept(
    client: SupabaseClient<Database>,
    id: string,
    updates: { name?: string; description?: string; category?: string; is_active?: boolean }
): Promise<{ data: MathConcept | null; error: string | null }> {
    const { data, error } = await (client as any)
        .from('math_concepts')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            return { data: null, error: 'A concept with this name already exists.' }
        }
        console.error('Error updating math concept:', error)
        return { data: null, error: error.message }
    }

    return { data: data as MathConcept, error: null }
}

/**
 * Delete a math concept
 */
export async function deleteMathConcept(
    client: SupabaseClient<Database>,
    id: string
): Promise<{ error: string | null }> {
    const { error } = await (client as any)
        .from('math_concepts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting math concept:', error)
        return { error: error.message }
    }

    return { error: null }
}
