# Step 5: Configure Cloudinary & Implement CDN Asset Upload Service

## Objective
Configure the Cloudinary SDK and build a service to upload generated base64 image data to the cloud CDN. Update the backend generation controller to upload data URIs directly to Cloudinary, replacing the raw base64 data returned to the React client with secure CDN HTTPS URLs. We will not set up MongoDB yet.

---

## 1. Package Installation & Env Setup

Install the Cloudinary package inside the `server` folder:
```bash
npm install cloudinary
```

Update your `server/.env` configuration file to include Cloudinary access tokens:
```env
# Cloudinary CDN Storage Credentials
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 2. Cloudinary Configuration (`server/src/config/cloudinary.js`)

Create a configuration script to load credentials and initialize Cloudinary v2:
```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

---

## 3. CDN Uploader Service (`server/src/services/cloudinaryService.js`)

Create the upload service. The service should accept base64 data URIs and call `cloudinary.uploader.upload` to upload assets directly:
```javascript
import cloudinary from '../config/cloudinary.js';

export async function uploadImageToCloudinary(imageBufferOrBase64) {
  try {
    const isBase64 = typeof imageBufferOrBase64 === 'string';

    if (isBase64) {
      // Cloudinary SDK automatically parses Base64 data URIs (e.g. data:image/jpeg;base64,...)
      const uploadResult = await cloudinary.uploader.upload(imageBufferOrBase64, {
        folder: 'imagefury',
      });
      return uploadResult.secure_url;
    } else {
      // Buffer fallback stream upload
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'imagefury' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(imageBufferOrBase64);
      });
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error.message || error);
    throw error;
  }
}

export default uploadImageToCloudinary;
```

---

## 4. Integrate Uploads in Generation Handler (`server/src/controllers/imageController.js`)

Modify the image generation controller to forward raw base64 data URIs to Cloudinary and retrieve secure HTTPS asset URLs:
```javascript
import { generateCloudflareImage } from '../services/cloudflareService.js';
import { uploadImageToCloudinary } from '../services/cloudinaryService.js';

export async function generateImage(req, res, next) {
  try {
    const prompt = req.body.prompt.trim();
    const userId = req.userId;

    const startTime = performance.now();

    // 1. Synthesize image via Cloudflare
    const base64Image = await generateCloudflareImage(prompt);

    // 2. Upload image base64 stream directly to Cloudinary
    const base64DataUri = `data:image/jpeg;base64,${base64Image}`;
    const imageUrl = await uploadImageToCloudinary(base64DataUri);

    const renderTimeSeconds = ((performance.now() - startTime) / 1000).toFixed(1);
    const renderTime = `${renderTimeSeconds}s`;
    const seed = Math.floor(Math.random() * 9000000) + 1000000;

    // 3. Return the saved document parameters to the client containing the CDN URL
    return res.status(200).json({
      id: `tmp-${Date.now()}`,
      prompt,
      modelName: 'ImageFury Core',
      aspectRatio: '1:1',
      imageUrl, // CDN URL hosted on Cloudinary
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

Start the application. Generated artwork should now be saved securely on Cloudinary and load via fast HTTPS CDN links.
