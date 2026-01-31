
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'apify_api_NkxEEbNUEpsZOhawi86jz36gePHLZ219XWn3',
});

async function testScrape() {
    console.log('Starting scrape...');
    try {
        const run = await client.actor("hKByXkMQaC5Qt9UMN").call({
            urls: ['https://www.linkedin.com/jobs/view/4351163553'],
            limit: 1,
        });

        console.log('Run finished:', run);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log('Items:', items);
    } catch (error) {
        console.error('Error:', error);
    }
}

testScrape();
