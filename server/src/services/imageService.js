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
