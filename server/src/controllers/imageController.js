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

export default generateImage;
