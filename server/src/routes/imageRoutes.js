import express from 'express';
import * as imageController from '../controllers/imageController.js';
import { validatePrompt } from '../middleware/validateRequest.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Protected route to generate image
router.post('/generate', requireAuth, validatePrompt, imageController.generateImage);

export default router;
