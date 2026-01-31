import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CvList } from '@/components/cv-list'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Quick count of CVs for stats
    const { count } = await supabase
        .from('generated_cvs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.email}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create CV
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{count || 0}</div>
                        <p className="text-xs text-muted-foreground">Lifetime generated</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Your CVs</h3>
                </div>
                <CvList />
            </div>
        </div>
    )
}
