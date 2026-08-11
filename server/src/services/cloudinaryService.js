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
