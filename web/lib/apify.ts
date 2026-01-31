import axios from 'axios';
import * as cheerio from 'cheerio';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export interface ScrapedJob {
    url: string;
    title: string;
    companyName: string;
    location: string;
    description: string;
    postedAt?: string;
    senorityLevel?: string;
    employmentType?: string;
}

export interface ScrapedProfile {
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
    location: string;
    email?: string;
}
export async function scrapeLinkedInJob(url: string): Promise<ScrapedJob> {

    // Normalize URL: If it has currentJobId, use that to build a clean view URL
    let targetUrl = url;
    try {
        const urlObj = new URL(url);
        const currentJobId = urlObj.searchParams.get("currentJobId");
        if (currentJobId) {
            targetUrl = `https://www.linkedin.com/jobs/view/${currentJobId}/`;
        }
    } catch (e) {
        // invalid url
    }

    console.log(`Scraping job from: ${targetUrl}`);

    try {
        // Attempt to fetch public page directly using standard User-Agent
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const $ = cheerio.load(response.data);

        // LinkedIn jobs usually embed JSON-LD with job details
        const jsonLdScript = $('script[type="application/ld+json"]');
        let jobSchema: any = null;

        if (jsonLdScript.length > 0) {
            try {
                const htmlContent = jsonLdScript.html();
                if (htmlContent) {
                    const jsonData = JSON.parse(htmlContent);
                    // The JSON-LD can be an object or array. Usually object for a single job view.
                    jobSchema = Array.isArray(jsonData) ? jsonData.find(j => j['@type'] === 'JobPosting') : jsonData;
                }
            } catch (parseError) {
                console.error("Error parsing JSON-LD", parseError);
            }
        }

        // Fallback: Try meta tags and common selectors if JSON-LD fails or isn't present
        const title = jobSchema?.title || $('h1.top-card-layout__title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
        const companyName = jobSchema?.hiringOrganization?.name || $('a.topcard__org-name-link').text().trim() || '';
        const location = jobSchema?.jobLocation?.address?.addressLocality || $('span.topcard__flavor--bullet').first().text().trim() || '';
        // Description is harder to get cleanly without JSON-LD on public view, but let's try standard container
        const descriptionHtml = jobSchema?.description || $('.show-more-less-html__markup').html() || '';

        if (!title) {
            throw new Error('Could not extract job title. The page structure might have changed or is blocked.');
        }

        return {
            url: targetUrl,
            title,
            companyName,
            company: companyName, // Map for compatibility
            location,
            description: descriptionHtml,
            postedAt: jobSchema?.datePosted,
            employmentType: jobSchema?.employmentType,
        } as any;

    } catch (error: any) {
        console.error("Direct Scraping Error:", error.message);
        throw new Error(`Failed to scrape job. LinkedIn might be blocking the request. (${error.message})`);
    }
}

export async function scrapeLinkedInProfile(profileUrl: string): Promise<ScrapedProfile> {
    // Using 'Mass Linkedin Profile Scraper with Email' (2SyF0bVxmgGr8IVCZ) as requested

    try {
        const run = await client.actor("2SyF0bVxmgGr8IVCZ").call({
            startUrls: [{ url: profileUrl }],
            // '2SyF0bVxmgGr8IVCZ' is "Mass Linkedin Profile Scraper with Email"
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (!items || items.length === 0) {
            throw new Error('Failed to scrape profile: No data returned.');
        }

        const profileData = items[0] as any;

        return {
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            headline: profileData.headline || profileData.occupation || '',
            summary: profileData.summary || profileData.about || '',
            experience: profileData.experience || [],
            education: profileData.education || [],
            skills: profileData.skills || [],
            location: profileData.location || '',
            email: profileData.email || '',
        };

    } catch (error) {
        console.error("Apify Profile Scraping Error:", error);
        throw new Error('Failed to scrape LinkedIn profile.');
    }
}
