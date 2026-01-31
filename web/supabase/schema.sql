-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create job_postings table
create table if not exists public.job_postings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  linkedin_url text not null,
  job_title text,
  company_name text,
  job_description text,
  raw_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.job_postings enable row level security;

create policy "Users can CRUD their own job postings"
  on job_postings for all
  using ( auth.uid() = user_id );

-- Create generated_cvs table
create table if not exists public.generated_cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  job_posting_id uuid references public.job_postings,
  content jsonb,
  pdf_url text,
  match_score integer,
  template_type text default 'minimal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.generated_cvs enable row level security;

create policy "Users can CRUD their own CVs"
  on generated_cvs for all
  using ( auth.uid() = user_id );

-- Function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Work Experiences Table
create table if not exists public.work_experiences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company_name text not null,
  position text not null,
  location text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  skills_used jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.work_experiences enable row level security;

create policy "Users can CRUD their own work experiences"
  on work_experiences for all
  using ( auth.uid() = user_id );

-- Educations Table
create table if not exists public.educations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  institution_name text not null,
  degree text not null,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean default false,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.educations enable row level security;

create policy "Users can CRUD their own educations"
  on educations for all
  using ( auth.uid() = user_id );

-- Skills Table
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skill_name text not null,
  proficiency_level text, -- Beginner, Intermediate, Advanced, Expert
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.skills enable row level security;

create policy "Users can CRUD their own skills"
  on skills for all
  using ( auth.uid() = user_id );

-- Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  project_name text not null,
  description text,
  role text,
  technologies_used jsonb default '[]'::jsonb,
  project_url text,
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Users can CRUD their own projects"
  on projects for all
  using ( auth.uid() = user_id );

-- Certifications Table
create table if not exists public.certifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  certification_name text not null,
  issuing_organization text not null,
  issue_date date,
  expiration_date date,
  credential_id text,
  credential_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.certifications enable row level security;

create policy "Users can CRUD their own certifications"
  on certifications for all
  using ( auth.uid() = user_id );

-- Languages Table
create table if not exists public.languages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  language_name text not null,
  proficiency_level text, -- Native, Fluent, Intermediate, Basic
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.languages enable row level security;

create policy "Users can CRUD their own languages"
  on languages for all
  using ( auth.uid() = user_id );

