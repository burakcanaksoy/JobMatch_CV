'use server'

import { scrapeLinkedInJob } from '@/lib/apify'
import { createClient } from '@/lib/supabase/server'
import { analyzeJobFit, generateCvContent } from '@/lib/ai'
import { FullProfile } from '@/lib/types'

export async function scrapeJobAction(url: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const jobData = await scrapeLinkedInJob(url)

        // Save to database
        const { data, error } = await supabase
            .from('job_postings')
            .insert({
                user_id: user.id,
                linkedin_url: url,
                job_title: jobData.title,
                company_name: jobData.companyName,
                // job_description: jobData.description, // Can be very long, ensure column is TEXT or JSONB if really huge, but TEXT handles large strings usually.
                raw_data: jobData, // Save full object just in case
            })
            .select()
            .single()

        if (error) {
            console.error('Database Error:', error)
            // We might continue even if save fails, but better to warn
        }

        return { success: true, data: jobData }
    } catch (error: any) {
        console.error('Scrape Action Error:', error)
        return { success: false, error: error.message || 'Failed to scrape job' }
    }
}

async function fetchFullProfile(userId: string): Promise<FullProfile> {
    const supabase = await createClient()

    // Run all queries in parallel for performance
    const [
        { data: profile },
        { data: work_experiences },
        { data: educations },
        { data: skills },
        { data: projects },
        { data: certifications },
        { data: languages }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('work_experiences').select('*').eq('user_id', userId),
        supabase.from('educations').select('*').eq('user_id', userId),
        supabase.from('skills').select('*').eq('user_id', userId),
        supabase.from('projects').select('*').eq('user_id', userId),
        supabase.from('certifications').select('*').eq('user_id', userId),
        supabase.from('languages').select('*').eq('user_id', userId)
    ])

    if (!profile) {
        throw new Error('Profile not found')
    }

    return {
        ...profile,
        work_experiences: work_experiences || [],
        educations: educations || [],
        skills: skills || [],
        projects: projects || [],
        certifications: certifications || [],
        languages: languages || []
    } as FullProfile;
}

export async function analyzeJobAction(jobDescription: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const fullProfile = await fetchFullProfile(user.id);
        const analysis = await analyzeJobFit(jobDescription, fullProfile);

        return { success: true, data: analysis };
    } catch (error: any) {
        console.error('Analysis Action Error:', error);
        return { success: false, error: error.message };
    }
}

export async function generateCvAction(jobDescription: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        const fullProfile = await fetchFullProfile(user.id);
        const cvContent = await generateCvContent(jobDescription, fullProfile);

        // Save Generated CV
        const { data: cv, error } = await supabase
            .from('generated_cvs')
            .insert({
                user_id: user.id,
                content: cvContent,
                match_score: 85, // We should get this from analysis or re-calculate
                template_type: 'minimal'
            })
            .select()
            .single()

        return { success: true, data: cvContent, cvId: cv?.id };

    } catch (error: any) {
        console.error('Generation Action Error:', error);
        return { success: false, error: error.message };
    }
}
