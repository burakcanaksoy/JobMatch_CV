
import { createClient } from '@supabase/supabase-js'
// import dotenv from 'dotenv'
// dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
    console.log('Checking generated_cvs table...');
    const { data, error } = await supabase
        .from('generated_cvs')
        .select('id')
        .limit(1);

    if (error) {
        console.error('Error accessing generated_cvs:', JSON.stringify(error, null, 2));
    } else {
        console.log('generated_cvs table exists. Data sample:', data);
    }

    console.log('Checking job_postings table...');
    const { data: jobData, error: jobError } = await supabase
        .from('job_postings')
        .select('id')
        .limit(1);

    if (jobError) {
        console.error('Error accessing job_postings:', JSON.stringify(jobError, null, 2));
    } else {
        console.log('job_postings table exists.');
    }
}

checkTable();
