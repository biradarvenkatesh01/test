import express from 'express';
import * as galleryController from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, galleryController.getGallery);
router.delete('/:id', requireAuth, galleryController.deleteGalleryImage);

export default router;
