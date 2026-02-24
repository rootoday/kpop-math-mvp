'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database.types'

export async function createMathConceptAction(formData: FormData) {
    const supabase = createServerActionClient<Database>({ cookies })

    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || ''
    const category = (formData.get('category') as string)?.trim() || 'general'

    if (!name) {
        return { error: 'Concept name is required' }
    }

    const { error } = await (supabase as any)
        .from('math_concepts')
        .insert({ name, description, category })

    if (error) {
        if (error.code === '23505') {
            return { error: 'A concept with this name already exists.' }
        }
        console.error('Error creating math concept:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/math-concepts')
    revalidatePath('/admin/lessons')
    return { success: true }
}

export async function updateMathConceptAction(id: string, formData: FormData) {
    const supabase = createServerActionClient<Database>({ cookies })

    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim() || ''
    const category = (formData.get('category') as string)?.trim() || 'general'
    const isActive = formData.get('is_active') === 'true'

    if (!name) {
        return { error: 'Concept name is required' }
    }

    const { error } = await (supabase as any)
        .from('math_concepts')
        .update({
            name,
            description,
            category,
            is_active: isActive,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        if (error.code === '23505') {
            return { error: 'A concept with this name already exists.' }
        }
        console.error('Error updating math concept:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/math-concepts')
    revalidatePath('/admin/lessons')
    return { success: true }
}

export async function deleteMathConceptAction(id: string) {
    const supabase = createServerActionClient<Database>({ cookies })

    const { error } = await (supabase as any)
        .from('math_concepts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting math concept:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/math-concepts')
    revalidatePath('/admin/lessons')
    return { success: true }
}
