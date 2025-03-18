import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Contest from '../models/Contest.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetch upcoming contests with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { platform, page = 1, limit = 10 } = req.query;
    const currentTime = new Date();

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const filter = {
      startTime: { $gte: currentTime },
      ...(platform ? { platform: { $in: platform.split(',') } } : {}),
    };

    const totalContests = await Contest.countDocuments(filter);
    const totalPages = Math.ceil(totalContests / limitNumber);

    const contests = await Contest.find(filter)
      .sort({ startTime: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({ contests, totalPages, currentPage: pageNumber });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Fetch past contests with pagination
router.get('/past', authMiddleware, async (req, res) => {
  try {
    const { platform, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const filter = {
      startTime: { $lt: new Date() },
      ...(platform ? { platform: { $in: platform.split(',') } } : {}),
    };

    const totalContests = await Contest.countDocuments(filter);
    const totalPages = Math.ceil(totalContests / limitNumber);

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

    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const objectIdContestId = new mongoose.Types.ObjectId(contestId);

    if (!user.bookmarks.some(id => id.equals(objectIdContestId))) {
      user.bookmarks.push(objectIdContestId);
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

    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      model: 'Contest'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Remove a bookmarked contest
router.delete('/bookmark', authMiddleware, async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const objectIdContestId = new mongoose.Types.ObjectId(contestId);

    user.bookmarks = user.bookmarks.filter((id) => !id.equals(objectIdContestId));
    await user.save();

    res.json({ message: 'Bookmark removed successfully', bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Fetch contest details by contestId
router.get('/:contestId', authMiddleware, async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    res.json(contest);
  } catch (error) {
    console.error('Error fetching contest details:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update contest YouTube URL by contestId
router.put('/:contestId/youtube-link', authMiddleware, async (req, res) => {
  try {
    const { contestId } = req.params;
    const { youtube_url } = req.body;

    let youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)[\w-]+(&[\w-]+=[\w-]+)*$/;
    
    if (!youtube_url || !youtubeUrlRegex.test(youtube_url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const contest = await Contest.findByIdAndUpdate(
      contestId,
      { youtube_url },
      { new: true }
    );

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    res.json({ message: 'YouTube link updated successfully', contest });
  } catch (error) {
    console.error("Error updating YouTube link:", error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
