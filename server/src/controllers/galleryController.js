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
