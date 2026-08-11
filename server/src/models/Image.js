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
