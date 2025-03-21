import mongoose from 'mongoose';
import Contest from '../models/Contest.js';
import Bookmark from '../models/Bookmark.js';
import bookmarkQueue from '../queues/bookmarkQueue.js';

// Fetch ongoing and upcoming contests with pagination
export const getContests = async (req, res) => {
  try {
    const { platform, page = 1, limit = 10 } = req.query;
    const currentTime = new Date();

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const platformFilter = platform ? { platform: { $in: platform.split(',') } } : {};

    const ongoingContests = await Contest.find({
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
      ...platformFilter,
    }).sort({ startTime: 1 }).lean();

    const upcomingFilter = { startTime: { $gte: currentTime }, ...platformFilter };
    const totalContests = await Contest.countDocuments(upcomingFilter);
    const totalPages = Math.ceil(totalContests / limitNumber);

    const upcomingContests = await Contest.find(upcomingFilter)
      .sort({ startTime: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    res.json({ ongoingContests, upcomingContests, totalPages, currentPage: pageNumber });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Fetch past contests with pagination
export const getPastContests = async (req, res) => {
  try {
    const { platform, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const filter = {
      endTime: { $lt: new Date() },
      ...(platform ? { platform: { $in: platform.split(',') } } : {}),
    };

    const totalContests = await Contest.countDocuments(filter);
    const totalPages = Math.ceil(totalContests / limitNumber);

    const contests = await Contest.find(filter)
      .sort({ startTime: -1 }) // Recent first
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    res.json({ contests, totalPages, currentPage: pageNumber });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Bookmark a contest using Bookmark collection
export const bookmarkContest = async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const contestExists = await Contest.findById(contestId);
    if (!contestExists) return res.status(404).json({ error: 'Contest not found' });

    const existingBookmark = await Bookmark.findOne({ userId, contestId });
    if (existingBookmark) return res.status(400).json({ error: 'Contest already bookmarked' });

    await Bookmark.create({ userId, contestId });

    // Publish the event to the queue
    await bookmarkQueue.add('contest_bookmarked', { userId, contestId });

    res.json({ message: 'Contest bookmarked and event published' });
  } catch (error) {
    console.error('Error bookmarking contest:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get bookmarked contests using Bookmark collection
export const getBookmarkedContests = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch bookmarks with contests populated
    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: 'contestId',
        select: 'name platform url startTime endTime youtube_url'
      })
      .lean();

    // Handle no bookmarks scenario
    if (bookmarks.length === 0) {
      return res.status(200).json({ message: 'No bookmarked contests found', contests: [] });
    }

    // Extract contests from bookmarks
    const contests = bookmarks.map(bookmark => bookmark.contestId);

    res.status(200).json({ contests });
  } catch (error) {
    console.error('Error fetching bookmarked contests:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Remove a bookmarked contest using Bookmark collection
export const removeBookmark = async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const deletedBookmark = await Bookmark.findOneAndDelete({ userId, contestId });
    if (!deletedBookmark) return res.status(404).json({ error: 'Bookmark not found' });

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Fetch contest details by contestId
export const getContestById = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const contest = await Contest.findById(contestId).lean();
    if (!contest) return res.status(404).json({ error: 'Contest not found' });

    res.json(contest);
  } catch (error) {
    console.error('Error fetching contest details:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update contest YouTube URL by contestId
export const updateYoutubeLink = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { youtube_url } = req.body;

    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)[\w-]+(&[\w-]+=[\w-]+)*$/;

    if (!youtube_url || !youtubeUrlRegex.test(youtube_url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const contest = await Contest.findByIdAndUpdate(
      contestId,
      { youtube_url },
      { new: true }
    ).lean();

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    res.json({ message: 'YouTube link updated successfully', contest });
  } catch (error) {
    console.error('Error updating YouTube link:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};
