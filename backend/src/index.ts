import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import connectDB from "./config/database"
import authRoutes from './routes/auth.routes';
import bookmarkRoutes from './routes/bookmark.routes'

// Load .env file from the project root (backend directory)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1',bookmarkRoutes)
 

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✓ API server running at http://localhost:${PORT}`);
    });
  } catch {
    console.error("API server was not started because MongoDB is unavailable.");
    process.exit(1);
  }
};

void startServer();
