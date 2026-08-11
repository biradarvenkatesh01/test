import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './config/db.js';

import imageRoutes from './routes/imageRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Initialize Database connection
connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Register Clerk middleware globally to automatically inspect JWT authorization headers
app.use(clerkMiddleware());

// Public Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Base backend is running',
  });
});

// App Router Bindings
app.use('/api', imageRoutes);
app.use('/api/gallery', galleryRoutes);

// Error Interceptor
app.use(errorHandler);

export default app;
