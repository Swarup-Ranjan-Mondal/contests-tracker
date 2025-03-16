import express from 'express';
import User from '../models/User.js';
import Contest from '../models/Contest.js';
import authMiddleware from '../middleware/authMiddleware.js';

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

// Bookmark a contest (Requires Authentication)
router.post('/bookmark', authMiddleware, async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId) {
      return res.status(400).json({ error: 'Contest ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.bookmarks.includes(contestId)) {
      user.bookmarks.push(contestId);
      await user.save();
    }

    res.json({ message: 'Contest bookmarked successfully', bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get Bookmarked Contests (Requires Authentication)
router.get('/bookmarks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('bookmarks');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Remove a bookmarked contest (Requires Authentication)
router.delete('/bookmark', authMiddleware, async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId) {
      return res.status(400).json({ error: 'Contest ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== contestId);
    await user.save();

    res.json({ message: 'Bookmark removed successfully', bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
