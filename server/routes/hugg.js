const hugging_key = process.env.HUGGING_FACE_KEY;

import fs from 'fs';
async function query(data) {
    console.log(data, "data");
    data = data.prompt;
    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            headers: {
                Authorization: "Bearer " + hugging_key,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
    }
    console.log("before returning");

    // to store the image as a file
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pwd=process.cwd();

	const path = `${pwd}/generated_images/${data}.png`;

    fs.writeFileSync(path, buffer);
    return path;
}

export default query;
