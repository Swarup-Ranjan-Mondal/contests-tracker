import express from 'express';
import cors from 'cors';

import connectDB from './services/db/connectDB.js';
import contestRoutes from './routes/contestRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = 6000;

// Middleware
app.use(express.json());
app.use(cors({ credentials: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/contests', contestRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
