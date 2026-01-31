import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Settings, LogOut, Home } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar for Desktop */}
            <aside className="hidden w-64 border-r bg-gray-50/40 md:block">
                <div className="flex h-16 items-center border-b px-6 font-bold text-xl">
                    <span className="text-primary">JobMatch</span>CV
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Home className="h-4 w-4" />
                            Overview
                        </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Profile
                        </Button>
                    </Link>
                    <Link href="/dashboard/cvs">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            My CVs
                        </Button>
                    </Link>
                    <Link href="/dashboard/new">
                        <Button variant="secondary" className="w-full justify-start gap-2">
                            <Plus className="h-4 w-4" />
                            Create New
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <form action={signOut}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="flex h-16 items-center justify-between border-b px-6 md:hidden">
                    <span className="font-bold">JobMatchCV</span>
                    {/* Mobile Menu Trigger would go here */}
                </header>
                <main className="flex-1 p-6 md:p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
