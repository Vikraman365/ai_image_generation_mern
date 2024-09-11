import fetch from 'node-fetch';
import fs from 'fs';

const hugging_key = process.env.HUGGING_FACE_KEY;

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function query(data) {
    console.log(data, "data");
    const promptData = data.prompt;
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
                {
                    headers: {
                        Authorization: "Bearer " + hugging_key,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: promptData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);

                if (errorData.error && errorData.error.includes('currently loading')) {
                    const waitTime = errorData.estimated_time || RETRY_DELAY;
                    console.log(`Model is loading, retrying in ${waitTime} ms...`);
                    await sleep(waitTime+1000);
                    attempts++;
                    continue;
                } else {
                    throw new Error('Failed to fetch from Hugging Face API');
                }
            }

            console.log("before returning");

            // to store the image as a file
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const pwd = process.cwd();
            const path = `${pwd}/generated_images/${promptData}.png`;

            fs.writeFileSync(path, buffer);
            return promptData;
        } catch (error) {
            console.error('Error in query function:', error);
            throw error;
        }
    }

    throw new Error('Exceeded maximum retry attempts to fetch from Hugging Face API');
}

export default query;
