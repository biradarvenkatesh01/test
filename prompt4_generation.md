# Step 4: Implement Cloudflare Worker Image Generation Pipeline

## Objective
Implement the core image generation pipeline. When the client POSTs a prompt, the backend will validate the input, forward the request to the Cloudflare Worker, read the binary response, and return the base64 image data back to the client. We will not set up MongoDB or Cloudinary yet; instead, the backend will return the raw base64 image data URI (`data:image/jpeg;base64,...`), allowing the frontend to immediately render the AI-generated output.

---

## 1. Environment Configurations

Update your `server/.env` file to include the Cloudflare Worker credentials:
```env
# Cloudflare Worker Endpoint & Access Key
WORKER_URL=https://...
WORKER_SECRET_KEY=...
```

---

## 2. Request Validation Middleware (`server/src/middleware/validateRequest.js`)

Create a middleware script to check that prompt parameters are present and formatted correctly:
```javascript
export function validatePrompt(req, res, next) {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Request body must contain a valid non-empty prompt string.',
    });
  }
  next();
}
```

---

## 3. Cloudflare Worker Client Service (`server/src/services/cloudflareService.js`)

Implement the service that communicates with the Cloudflare Worker. It POSTs the prompt, checks the response status, converts the binary image stream into an array buffer, and outputs a base64 string:
```javascript
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
```

---

## 4. Image Controller (`server/src/controllers/imageController.js`)

Coordinate the workflow inside `generateImage`. Since Cloudinary is not ready, compile the base64 output as a data URI:
```javascript
import { generateCloudflareImage } from '../services/cloudflareService.js';

export async function generateImage(req, res, next) {
  try {
    const prompt = req.body.prompt.trim();
    const userId = req.userId;

    const startTime = performance.now();

    // 1. Synthesize image via Cloudflare
    const base64Image = await generateCloudflareImage(prompt);

    // 2. Wrap as data URI for direct frontend compatibility
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    const renderTimeSeconds = ((performance.now() - startTime) / 1000).toFixed(1);
    const renderTime = `${renderTimeSeconds}s`;
    const seed = Math.floor(Math.random() * 9000000) + 1000000;

    // 3. Return the serialized image object matching the client contract
    return res.status(200).json({
      id: `tmp-${Date.now()}`,
      prompt,
      modelName: 'ImageFury Core',
      aspectRatio: '1:1',
      imageUrl,
      width: 1024,
      height: 1024,
      renderTime,
      seed,
      userId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    const status = error.status || error.statusCode || 500;
    const message = error.message || 'An error occurred during image generation';

    const err = new Error(message);
    err.statusCode = status;
    next(err);
  }
}

export default generateImage;
```

---

## 5. Map Route (`server/src/routes/imageRoutes.js`)

Update the route mappings in the backend:
```javascript
import express from 'express';
import * as imageController from '../controllers/imageController.js';
import { validatePrompt } from '../middleware/validateRequest.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Protected route to generate image
router.post('/generate', requireAuth, validatePrompt, imageController.generateImage);

export default router;
```

Test generating images from the frontend. The application should now render actual images created dynamically by your Cloudflare Worker!
