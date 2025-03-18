import express from 'express';
import User from '../models/User.js';
import Contest from '../models/Contest.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetch upcoming contests with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { platform, page = 1, limit = 10 } = req.query;
    const currentTime = new Date();

    // Convert page & limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build filter
    const filter = {
      startTime: { $gte: currentTime },
      ...(platform ? { platform: { $in: platform.split(',') } } : {}),
    };

    // Get total count for pagination
    const totalContests = await Contest.countDocuments(filter);
    const totalPages = Math.ceil(totalContests / limitNumber);

    // Fetch contests with pagination
    const contests = await Contest.find(filter)
      .sort({ startTime: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({ contests, totalPages, currentPage: pageNumber });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Fetch past contests with pagination
router.get('/past', authMiddleware, async (req, res) => {
  try {
    const { platform, page = 1, limit = 10 } = req.query;

    // Convert page & limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build filter
    const filter = {
      startTime: { $lt: new Date() },
      ...(platform ? { platform: { $in: platform.split(',') } } : {}),
    };

    // Get total count for pagination
    const totalContests = await Contest.countDocuments(filter);
    const totalPages = Math.ceil(totalContests / limitNumber);

    // Fetch contests with pagination
    const contests = await Contest.find(filter)
      .sort({ startTime: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({ contests, totalPages, currentPage: pageNumber });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Bookmark a contest
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

// Get Bookmarked Contests
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

// Remove a bookmarked contest
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
