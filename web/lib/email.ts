import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'JobMatchCV <onboarding@resend.dev>', // Use default until user configures custom domain
            to: email,
            subject: 'Welcome to JobMatchCV! 🚀',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome aboard, ${name}!</h1>
            <p>We are thrilled to help you land your dream job.</p>
            <p>With JobMatchCV, you can:</p>
            <ul>
                <li>Scrape job details from LinkedIn</li>
                <li>Analyze your fit with AI</li>
                <li>Generate tailored CVs in seconds</li>
            </ul>
            <p>Head over to your dashboard to create your first CV!</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/new" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Create CV</a>
        </div>
      `,
        });

        if (error) {
            console.error('Email Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email Exception:', error);
        return { success: false, error };
    }
}
