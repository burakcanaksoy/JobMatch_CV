'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { sendWelcomeEmailAction, autoConfirmUserAction, signUpWithAdminAction } from '@/app/actions/auth-actions'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                // Use Server Action to sign up (bypasses IP rate limits and auto confirms)
                const res = await signUpWithAdminAction(email, password, name)

                if (!res.success) {
                    throw new Error(res.error)
                }

                // Send welcome email
                await sendWelcomeEmailAction(email, name || 'User');

                toast.success('Account created! You can now log in immediately.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                toast.success('Logged in successfully')
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error: any) {
            console.error(error)
            if (error.message.includes('Email not confirmed')) {
                toast.error('Please confirm your email address first. Check your inbox for a confirmation link from Supabase.')
            } else {
                toast.error(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
            <div className="grid w-full max-w-5xl lg:grid-cols-2">
                <div className="hidden lg:flex flex-col justify-center p-12 bg-black text-white rounded-l-2xl">
                    <div className="text-3xl font-bold mb-6">JobMatchCV</div>
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        Tailor Your CV <br />
                        in Seconds.
                    </h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Join thousands of professionals who are landing their dream jobs with AI-optimized resumes.
                    </p>
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center text-xs">U{i}</div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs text-white">1k+</div>
                    </div>
                </div>

                <div className="flex items-center justify-center lg:p-12 bg-white rounded-r-2xl shadow-xl">
                    <div className="w-full max-w-sm space-y-6">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl font-bold">{isSignUp ? 'Create an account' : 'Welcome back'}</h2>
                            <p className="text-muted-foreground mt-2">
                                {isSignUp ? 'Enter your details to get started' : 'Enter your email to sign in to your account'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {isSignUp && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button className="w-full" disabled={loading} size="lg">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSignUp ? 'Sign Up' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            </span>
                            <button
                                type="button"
                                className="font-semibold underline hover:text-primary"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
