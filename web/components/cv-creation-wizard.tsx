'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2, CheckCircle, ArrowRight, ArrowLeft, Download } from 'lucide-react'
import { scrapeJobAction, analyzeJobAction, generateCvAction } from '@/app/actions/cv-actions'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CVPdfDocument } from '@/components/cv-pdf-document'

export default function CvCreationWizard() {
    const [step, setStep] = useState(1)
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [jobData, setJobData] = useState<any>(null)
    const [analysis, setAnalysis] = useState<any>(null)
    const [cvContent, setCvContent] = useState<any>(null)
    const router = useRouter()

    const handleScrape = async () => {
        if (!url) {
            toast.error('Please enter a valid LinkedIn URL')
            return
        }

        setLoading(true)
        try {
            const result = await scrapeJobAction(url)
            if (result.success) {
                setJobData(result.data)
                setStep(2) // Move to analysis/review step
                toast.success('Job details fetched successfully')
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            console.error(error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-between">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${step >= s
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted text-muted-foreground'
                                }`}
                        >
                            {step > s ? <CheckCircle className="h-6 w-6" /> : s}
                        </div>
                        {s < 4 && (
                            <div
                                className={`h-1 w-16 sm:w-24 md:w-32 ${step > s ? 'bg-primary' : 'bg-muted'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Job Input */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>What job are you applying for?</CardTitle>
                        <CardDescription>
                            We'll analyze the job description to tailor your CV perfectly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs defaultValue="url" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="url">LinkedIn URL</TabsTrigger>
                                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                            </TabsList>

                            <TabsContent value="url" className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="url">LinkedIn Job URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="url"
                                            placeholder="https://www.linkedin.com/jobs/view/..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Paste the full URL of the LinkedIn job posting.
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="manual" className="space-y-4 py-4">
                                <div className="rounded-md bg-yellow-50 p-4 text-yellow-800 text-sm">
                                    Manual entry is coming soon. Please use the URL method for now.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleScrape} disabled={loading} size="lg">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 2: Confirmation / Analysis Preview */}
            {step === 2 && jobData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Job Analysis Result</CardTitle>
                        <CardDescription>
                            Please review the extracted information before generating your CV.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">Job Title</Label>
                            <div className="font-semibold text-lg">{jobData.title}</div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">Company</Label>
                            <div className="font-medium">{jobData.companyName}</div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">Location</Label>
                            <div className="font-medium">{jobData.location}</div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground">Description Snippet</Label>
                            <div className="rounded-md bg-muted p-4 text-sm max-h-40 overflow-y-auto">
                                {jobData.description.substring(0, 500)}...
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={() => setStep(3)}>
                            Next: AI Analysis <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 3: Analysis & Profile Match */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>AI Profile Analysis</CardTitle>
                        <CardDescription>
                            Click analyze to see how well you match this job.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!analysis ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <Button onClick={async () => {
                                    setLoading(true);
                                    const res = await analyzeJobAction(jobData.description);
                                    setLoading(false);
                                    if (res.success) setAnalysis(res.data);
                                    else toast.error(res.error);
                                }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Analyze Match
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl font-bold text-primary">{analysis.matchScore}%</div>
                                    <div className="text-muted-foreground">Match Score</div>
                                </div>
                                <div className="p-4 bg-muted rounded-md">
                                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                                    <ul className="list-disc pl-5 text-sm">
                                        {analysis.recommendations?.map((rec: string, i: number) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-muted rounded-md">
                                    <h4 className="font-semibold mb-2">Analysis Summary:</h4>
                                    <p className="text-sm">{analysis.summary}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                        <Button onClick={() => setStep(4)} disabled={!analysis}>
                            Next: Generate CV
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Step 4: Generation */}
            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Your CV</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>We are ready to generate your tailored CV based on the analysis.</p>
                        {!cvContent && (
                            <Button onClick={async () => {
                                setLoading(true);
                                const res = await generateCvAction(jobData.description);
                                setLoading(false);
                                if (res.success) {
                                    setCvContent(res.data);
                                    toast.success("CV Generated!");
                                }
                                else toast.error(res.error);
                            }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                Generate CV
                            </Button>
                        )}
                        {cvContent && (
                            <div className="space-y-6">
                                <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    CV Generated Successfully!
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button className="w-full" asChild variant="outline">
                                        <PDFDownloadLink
                                            document={<CVPdfDocument data={cvContent} />}
                                            fileName={`CT.pdf`}
                                        >
                                            {({ blob, url, loading, error }) =>
                                                loading ? 'Preparing PDF...' : (
                                                    <>
                                                        <Download className="mr-2 h-4 w-4" /> Download PDF
                                                    </>
                                                )
                                            }
                                        </PDFDownloadLink>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <a href="/dashboard">Return to Dashboard</a>
                                    </Button>
                                </div>

                                <div className="border p-4 rounded-md shadow-sm bg-gray-50 text-xs font-mono h-[300px] overflow-auto">
                                    <h4 className="font-bold mb-2">JSON Preview:</h4>
                                    <pre>{JSON.stringify(cvContent, null, 2)}</pre>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
