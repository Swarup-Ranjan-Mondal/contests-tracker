import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contestRoutes from './routes/contestRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { startContestUpdater } from './services/contestService.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

// Database Connection
connectDB();

// API Routes
app.use('/api/contests', contestRoutes); // Contests API
app.use('/api/auth', authRoutes); // Authentication API

// Start periodic contest fetching
// startContestUpdater();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
