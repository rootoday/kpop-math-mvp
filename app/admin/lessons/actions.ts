'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database.types'
import type { TierContent } from '@/types'

export async function createLesson(formData: FormData) {
    const supabase = createServerActionClient<Database>({
        cookies: () => cookies()
    })

    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const mathConcept = formData.get('math_concept') as string
    const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced'

    const tierContentRaw = formData.get('tier_content') as string
    let tierContent: TierContent

    try {
        tierContent = JSON.parse(tierContentRaw)
    } catch (e) {
        return { error: 'Invalid JSON format for tier content' }
    }

    const { error } = await (supabase as any)
        .from('lessons')
        .insert({
            title,
            artist,
            math_concept: mathConcept,
            difficulty,
            tier_content: tierContent
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/lessons')
    revalidatePath('/dashboard')
    redirect('/admin/lessons')
}

export async function updateLesson(id: string, formData: FormData) {
    const supabase = createServerActionClient<Database>({
        cookies: () => cookies()
    })

    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const mathConcept = formData.get('math_concept') as string
    const difficulty = formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced'

    const tierContentRaw = formData.get('tier_content') as string
    let tierContent: TierContent

    try {
        tierContent = JSON.parse(tierContentRaw)
    } catch (e) {
        return { error: 'Invalid JSON format for tier content' }
    }

    const { error } = await (supabase as any)
        .from('lessons')
        .update({
            title,
            artist,
            math_concept: mathConcept,
            difficulty,
            tier_content: tierContent,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/lessons')
    revalidatePath('/dashboard')
    revalidatePath(`/lessons/${id}`)
    redirect('/admin/lessons')
}

export async function deleteLesson(id: string) {
    const supabase = createServerActionClient<Database>({
        cookies: () => cookies()
    })

    const { error } = await (supabase as any)
        .from('lessons')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/lessons')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function getLesson(id: string) {
    const supabase = createServerActionClient<Database>({
        cookies: () => cookies()
    })

    const { data, error } = await (supabase as any)
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return { error: error.message }
    }

    return { data }
}
