import CvCreationWizard from '@/components/cv-creation-wizard'

export default function NewCVPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create New CV</h1>
                <p className="text-muted-foreground mt-2">
                    Let's start by analyzing the job you want to apply for.
                </p>
            </div>
            <CvCreationWizard />
        </div>
    )
}
