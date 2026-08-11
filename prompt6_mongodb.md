# Step 6: Connect MongoDB Atlas & Persist Artwork Metadata

## Objective
Establish database persistence by connecting to MongoDB using Mongoose. Implement schemas, metadata services, and controllers to save generated artwork records, retrieve individual gallery catalogues, and delete items from MongoDB. This completes the core backend functionality.

---

## 1. Package Installation & Env Setup

Install Mongoose inside the `server` directory:
```bash
npm install mongoose
```

Update your `server/.env` configuration to include your MongoDB connection string:
```env
# MongoDB Atlas connection URI
MONGO_URI=mongodb+srv://...
```

---

## 2. Database Connection Configuration (`server/src/config/db.js`)

Create the database connection handler:
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('CRITICAL: MONGO_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn('Backend is running, but database operations will fail until MongoDB is started.');
  }
}

export default connectDB;
```

---

## 3. Define Mongoose Database Schema (`server/src/models/Image.js`)

Define the collection structure. Reconfigure JSON serialization to return virtual `id` strings and clean up private keys:
```javascript
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    default: 'ImageFury Core',
  },
  aspectRatio: {
    type: String,
    default: '1:1',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 1024,
  },
  height: {
    type: Number,
    default: 1024,
  },
  renderTime: {
    type: String,
    required: true,
  },
  seed: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ImageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema);
export default Image;
```

---

## 4. DB Storage Utilities (`server/src/services/imageService.js`)

Implement CRUD queries:
```javascript
import Image from '../models/Image.js';

export async function saveImageMetadata(data) {
  try {
    const newImage = new Image(data);
    return await newImage.save();
  } catch (error) {
    console.error('Failed to save image metadata:', error.message || error);
    throw error;
  }
}

export async function getImagesByUserId(userId) {
  try {
    return await Image.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Failed to fetch images from MongoDB:', error.message || error);
    throw error;
  }
}

export async function deleteImageById(id, userId) {
  try {
    const result = await Image.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Failed to delete image document:', error.message || error);
    throw error;
  }
}
```

---

## 5. Update App Connection & Handler Logic

1. **`server/src/app.js`**:
   * Import `connectDB` and call it at the top of the file:
     ```javascript
     import { connectDB } from './config/db.js';
     
     // Initialize Database connection
     connectDB();
     ```

2. **`server/src/controllers/imageController.js`**:
   * Replace placeholder response logic with the actual database persistence call:
     ```javascript
     import { generateCloudflareImage } from '../services/cloudflareService.js';
     import { uploadImageToCloudinary } from '../services/cloudinaryService.js';
     import { saveImageMetadata } from '../services/imageService.js';

     export async function generateImage(req, res, next) {
       try {
         const prompt = req.body.prompt.trim();
         const userId = req.userId;

         const startTime = performance.now();
         const base64Image = await generateCloudflareImage(prompt);
         const base64DataUri = `data:image/jpeg;base64,${base64Image}`;
         const imageUrl = await uploadImageToCloudinary(base64DataUri);

         const renderTimeSeconds = ((performance.now() - startTime) / 1000).toFixed(1);
         const renderTime = `${renderTimeSeconds}s`;
         const seed = Math.floor(Math.random() * 9000000) + 1000000;

         // Save to MongoDB
         const savedImage = await saveImageMetadata({
           prompt,
           modelName: 'ImageFury Core',
           aspectRatio: '1:1',
           imageUrl,
           width: 1024,
           height: 1024,
           renderTime,
           seed,
           userId,
         });

         return res.status(200).json(savedImage.toJSON());
       } catch (error) {
         next(error);
       }
     }
     ```

3. **`server/src/controllers/galleryController.js`**:
   * Create the gallery fetch and delete handler:
     ```javascript
     import { getImagesByUserId, deleteImageById } from '../services/imageService.js';

     export async function getGallery(req, res, next) {
       try {
         const userId = req.userId;
         const images = await getImagesByUserId(userId);
         return res.status(200).json(images);
       } catch (error) {
         next(error);
       }
     }

     export async function deleteGalleryImage(req, res, next) {
       try {
         const { id } = req.params;
         const userId = req.userId;
         
         const wasDeleted = await deleteImageById(id, userId);
         
         if (!wasDeleted) {
           return res.status(404).json({
             success: false,
             message: 'Image not found or unauthorized to delete.',
           });
         }

         return res.sendStatus(204);
       } catch (error) {
         next(error);
       }
     }
     ```

4. **`server/src/routes/galleryRoutes.js`**:
   * Wire the stub gallery routes to the actual controllers:
     ```javascript
     import express from 'express';
     import * as galleryController from '../controllers/galleryController.js';
     import { requireAuth } from '../middleware/auth.js';

     const router = express.Router();

     router.get('/', requireAuth, galleryController.getGallery);
     router.delete('/:id', requireAuth, galleryController.deleteGalleryImage);

     export default router;
     ```

Re-run both the client and server. The entire AI Image Generator app is now fully functional, saving outputs to Cloudinary and cataloging user art in MongoDB Atlas!
