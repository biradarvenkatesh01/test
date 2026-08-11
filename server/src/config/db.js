import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

export async function connectDB() {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('CRITICAL: MONGO_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`MongoDB connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn('Backend is running, but database operations will fail until MongoDB is started.');
  }
}

export default connectDB;
