'use server'

import { sendWelcomeEmail } from '@/lib/email'

export async function sendWelcomeEmailAction(email: string, name: string) {
    // We don't need strict auth check here as this is called during/after signup.
    // In strict mode, we'd check if user exists in DB.

    await sendWelcomeEmail(email, name);
    await sendWelcomeEmail(email, name);
}

import { createClient } from '@supabase/supabase-js'

export async function autoConfirmUserAction(userId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Missing Supabase Service Role Key');
        return { success: false, error: 'Server configuration error' };
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
    )

    if (error) {
        console.error('Auto check error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function signUpWithAdminAction(email: string, password: string, name: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { success: false, error: 'Server configuration error' };
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirm immediately
        user_metadata: { full_name: name }
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true, user: data.user }
}
