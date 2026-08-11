export async function generateCloudflareImage(prompt) {
  const workerUrl = process.env.WORKER_URL;
  const workerSecret = process.env.WORKER_SECRET_KEY;

  if (!workerUrl || !workerSecret) {
    throw new Error('Cloudflare Worker configuration is missing in environment variables.');
  }

  console.log(`Routing image generation request via Cloudflare Worker: ${workerUrl}`);
  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${workerSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker returned error status ${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    return base64Data;
  } catch (error) {
    console.error('Cloudflare Worker image generation failed:', error.message || error);
    throw error;
  }
}
