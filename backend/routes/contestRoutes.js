import express from 'express';
import Contest from '../models/Contest.js';

const router = express.Router();

// Fetch upcoming contests
router.get('/', async (req, res) => {
  try {
    const { platform } = req.query;
    const filter = platform ? { platform: { $in: platform.split(',') } } : {};
    const contests = await Contest.find(filter).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Fetch past contests
router.get('/past', async (req, res) => {
  try {
    const { platform } = req.query;
    const filter = platform ? { platform: { $in: platform.split(',') } } : {};
    const contests = await Contest.find({ ...filter, startTime: { $lt: new Date() } }).sort({ startTime: -1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
