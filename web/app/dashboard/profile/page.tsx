import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Briefcase, GraduationCap, Award, Trash2, MapPin, Calendar } from 'lucide-react'
import { WorkExperienceForm, EducationForm, SkillsForm } from '@/components/profile-forms'
import { deleteWorkExperienceAction, deleteEducationAction, deleteSkillAction } from '@/app/actions/profile-actions'
import { revalidatePath } from 'next/cache'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <div>Unauthorized</div>

    // Fetch data directly in server component (could also use the action, but direct is fine too)
    const [
        { data: profile },
        { data: work_experiences },
        { data: educations },
        { data: skills }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('work_experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('educations').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', user.id)
    ])

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                    <p className="text-muted-foreground">
                        Manage your professional details. This data is used to generate your tailored CVs.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your basic contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 max-w-lg gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="font-medium">{profile?.email || user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Work Experience */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" /> Work Experience
                            </CardTitle>
                            <CardDescription>Your past and current roles.</CardDescription>
                        </div>
                        <WorkExperienceForm />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {work_experiences?.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No work experience added yet.</p>
                        )}
                        {work_experiences?.map((exp: any) => (
                            <div key={exp.id} className="relative pl-6 border-l-2 border-muted pb-6 last:pb-0">
                                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg">{exp.position}</h4>
                                        <p className="text-primary font-medium">{exp.company_name}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(exp.start_date).toLocaleDateString()} - {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                                            </span>
                                            {exp.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {exp.location}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                    <form action={async () => {
                                        'use server'
                                        const supabase = await createClient() // Need fresh client
                                        await supabase.from('work_experiences').delete().eq('id', exp.id)
                                        revalidatePath('/dashboard/profile')
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Education */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" /> Education
                            </CardTitle>
                            <CardDescription>Your educational background.</CardDescription>
                        </div>
                        <EducationForm />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {educations?.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No education added yet.</p>
                        )}
                        {educations?.map((edu: any) => (
                            <div key={edu.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-bold">{edu.institution_name}</h4>
                                    <p className="text-sm font-medium">{edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(edu.start_date).getFullYear()} - {edu.is_current ? 'Present' : new Date(edu.end_date).getFullYear()}
                                    </p>
                                </div>
                                <form action={async () => {
                                    'use server'
                                    const supabase = await createClient()
                                    await supabase.from('educations').delete().eq('id', edu.id)
                                    revalidatePath('/dashboard/profile')
                                }}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" /> Skills
                            </CardTitle>
                            <CardDescription>Your technical and soft skills.</CardDescription>
                        </div>
                        <SkillsForm />
                    </CardHeader>
                    <CardContent>
                        {skills?.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {skills?.map((skill: any) => (
                                <Badge key={skill.id} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
                                    {skill.skill_name}
                                    <span className="text-xs text-muted-foreground border-l pl-2">{skill.proficiency_level}</span>
                                    <form action={async () => {
                                        'use server'
                                        const supabase = await createClient()
                                        await supabase.from('skills').delete().eq('id', skill.id)
                                        revalidatePath('/dashboard/profile')
                                    }}>
                                        <button type="submit" className="ml-1 hover:text-destructive">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </form>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
