import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contestRoutes from './routes/contestRoutes.js';
import { startContestUpdater } from './services/contestService.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

// API Routes
app.use('/api/contests', contestRoutes);

// Start periodic contest fetching
startContestUpdater();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
