import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">JobMatch</span>CV
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Not Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 py-12 md:py-24 lg:py-32">
          <div className="container flex flex-col items-center gap-4 text-center">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              🚀 AI-Powered Resume Builder
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent pb-2">
              Tailor Your CV to Any Job <br className="hidden md:block" />
              in Seconds with Artificial Intelligence
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Paste a LinkedIn job URL, and our AI will analyze the requirements to generate a perfectly optimized CV that passes ATS systems.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Create My CV Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> 14-day free trial
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Simple Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Generate a professional, targeted resume in three simple steps.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold">Paste Job URL</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Copy the link of the LinkedIn job posting you want to apply for.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Our AI extracts key skills and keywords to match your profile with the job.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold">Download CV</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get a perfectly formatted PDF resume ready to submit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by JobMatchCV. © 2026.
          </p>
        </div>
      </footer>
    </div>
  )
}
