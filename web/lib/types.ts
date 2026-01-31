export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface WorkExperience {
    id: string;
    user_id: string;
    company_name: string;
    position: string;
    location: string | null;
    start_date: string | null; // ISO Date string
    end_date: string | null;   // ISO Date string
    is_current: boolean;
    description: string | null;
    skills_used: string[];
    created_at: string;
}

export interface Education {
    id: string;
    user_id: string;
    institution_name: string;
    degree: string;
    field_of_study: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    created_at: string;
}

export interface Skill {
    id: string;
    user_id: string;
    skill_name: string;
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | null;
    created_at: string;
}

export interface Project {
    id: string;
    user_id: string;
    project_name: string;
    description: string | null;
    role: string | null;
    technologies_used: string[];
    project_url: string | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

export interface Certification {
    id: string;
    user_id: string;
    certification_name: string;
    issuing_organization: string;
    issue_date: string | null;
    expiration_date: string | null;
    credential_id: string | null;
    credential_url: string | null;
    created_at: string;
}

export interface Language {
    id: string;
    user_id: string;
    language_name: string;
    proficiency_level: 'Native' | 'Fluent' | 'Intermediate' | 'Basic' | null;
    created_at: string;
}

// Composite type for the "Full Profile" needed by AI
export interface FullProfile extends Profile {
    work_experiences: WorkExperience[];
    educations: Education[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    languages: Language[];
}
