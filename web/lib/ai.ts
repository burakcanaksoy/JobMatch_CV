import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface JobAnalysisResult {
    matchScore: number;
    keySkills: string[];
    missingSkills: string[];
    recommendations: string[];
    summary: string;
}

export async function analyzeJobFit(jobDescription: string, userProfile: any): Promise<JobAnalysisResult> {
    const prompt = `
    You are an expert career coach and CV optimizer.
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    USER PROFILE:
    ${JSON.stringify(userProfile)}
    
    Analyze the fit between the user and the job. 
    Return a JSON object with the following structure:
    {
      "matchScore": number (0-100),
      "keySkills": string[] (skills required by the job),
      "missingSkills": string[] (skills the user lacks),
      "recommendations": string[] (3-5 specific tips to improve the CV for this job),
      "summary": string (brief analysis of the fit)
    }
  `;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });
        // ...


        const contentBlock = msg.content[0];
        if (contentBlock.type === 'text') {
            // Simple heuristic to extract JSON if it's wrapped in text
            const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        throw new Error('Failed to parse AI response');
    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Fallback or rethrow
        throw error;
    }
}

export async function generateCvContent(jobDescription: string, userProfile: any): Promise<any> {
    const prompt = `
      You are an expert CV writer.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      USER PROFILE:
      ${JSON.stringify(userProfile)}
      
      Generate a CV tailored specifically for this job description.
      - Highlight skills relevant to the job.
      - Rewrite experience bullet points to match job keywords (without lying).
      - Add a strong professional summary.
      
      Return the CV content as a JSON object structured for a standard CV template:
      {
        "personalInfo": { ... },
        "summary": "...",
        "experience": [ ... ],
        "education": [ ... ],
        "skills": [ ... ],
        "projects": [ ... ]
      }
    `;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }],
        });

        const contentBlock = msg.content[0];
        if (contentBlock.type === 'text') {
            const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        throw new Error('Failed to parse AI response');
    } catch (error) {
        console.error("CV Generation Error:", error);
        throw error;
    }
}
