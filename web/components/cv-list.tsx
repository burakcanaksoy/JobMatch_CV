import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, MoreVertical, Calendar, Building2, Download } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export async function CvList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch CVs along with job posting details
    const { data: cvs, error } = await supabase
        .from('generated_cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching CVs:", error)
        return <div>Error loading CVs</div>
    }

    if (!cvs || cvs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No CVs created yet</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                    You haven't generated any CVs yet. Start by analyzing a job posting.
                </p>
                <Button asChild>
                    <Link href="/dashboard/new">Create your first CV</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv: any) => (
                <Card key={cv.id} className="flex flex-col transition-all hover:shadow-md">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="line-clamp-1 text-base">
                                    {cv.job_postings?.job_title || 'Untitled Position'}
                                </CardTitle>
                                <CardDescription className="line-clamp-1 flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {cv.job_postings?.company_name || 'Unknown Company'}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Link href={`/dashboard/cv/${cv.id}`} className="flex w-full">
                                            View Details
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-2">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Match Score</span>
                                <Badge variant={cv.match_score >= 80 ? 'default' : cv.match_score >= 50 ? 'secondary' : 'destructive'} className="w-fit">
                                    {cv.match_score}%
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Template</span>
                                <span className="capitalize text-xs border px-2 py-0.5 rounded-md bg-gray-50">{cv.template_type}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2 text-xs text-muted-foreground border-t bg-gray-50/50 mt-4 rounded-b-lg">
                        <div className="flex items-center w-full justify-between py-2">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(cv.created_at), { addSuffix: true })}
                            </span>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
