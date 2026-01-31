'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { WorkExperience, Education, Skill, Project, Certification, Language } from '@/lib/types'

export async function getProfileAction() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    // Fetch all related data
    const [
        { data: profile },
        { data: work_experiences },
        { data: educations },
        { data: skills },
        { data: projects },
        { data: certifications },
        { data: languages }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('work_experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('educations').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', user.id),
        supabase.from('projects').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('certifications').select('*').eq('user_id', user.id),
        supabase.from('languages').select('*').eq('user_id', user.id)
    ])

    return {
        success: true,
        data: {
            profile,
            work_experiences: work_experiences || [],
            educations: educations || [],
            skills: skills || [],
            projects: projects || [],
            certifications: certifications || [],
            languages: languages || []
        }
    }
}

// --- Work Experience Actions ---

export async function addWorkExperienceAction(data: Omit<WorkExperience, 'id' | 'user_id' | 'created_at'>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase.from('work_experiences').insert({ ...data, user_id: user.id })
    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function deleteWorkExperienceAction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase.from('work_experiences').delete().eq('id', id).eq('user_id', user.id)
    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

// --- Education Actions ---

export async function addEducationAction(data: Omit<Education, 'id' | 'user_id' | 'created_at'>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase.from('educations').insert({ ...data, user_id: user.id })
    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function deleteEducationAction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase.from('educations').delete().eq('id', id).eq('user_id', user.id)
    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

// --- Skill Actions ---

export async function addSkillAction(data: Omit<Skill, 'id' | 'user_id' | 'created_at'>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase.from('skills').insert({ ...data, user_id: user.id })
    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: true }
}

export async function deleteSkillAction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase.from('skills').delete().eq('id', id).eq('user_id', user.id)
    if (error) return { success: false, error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: true }
}
