import mongoose from 'mongoose';
import Contest from '../models/Contest.js';
import User from '../models/User.js';

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
    }).sort({ startTime: 1 });

    const upcomingFilter = { startTime: { $gte: currentTime }, ...platformFilter };
    const totalContests = await Contest.countDocuments(upcomingFilter);
    const totalPages = Math.ceil(totalContests / limitNumber);

    const upcomingContests = await Contest.find(upcomingFilter)
      .sort({ startTime: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

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
      .sort({ startTime: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({ contests, totalPages, currentPage: pageNumber });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Bookmark a contest
export const bookmarkContest = async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const objectIdContestId = new mongoose.Types.ObjectId(contestId);
    if (!user.bookmarks.some(id => id.equals(objectIdContestId))) {
      user.bookmarks.push(objectIdContestId);
      await user.save();
    }

    res.json({ message: 'Contest bookmarked successfully', bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get Bookmarked Contests
export const getBookmarkedContests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({ path: 'bookmarks', model: 'Contest' });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Remove a bookmarked contest
export const removeBookmark = async (req, res) => {
  try {
    const { contestId } = req.body;
    const userId = req.user.userId;

    if (!contestId || !mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ error: 'Invalid Contest ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const objectIdContestId = new mongoose.Types.ObjectId(contestId);
    user.bookmarks = user.bookmarks.filter((id) => !id.equals(objectIdContestId));
    await user.save();

    res.json({ message: 'Bookmark removed successfully', bookmarks: user.bookmarks });
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

    const contest = await Contest.findById(contestId);
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
};
