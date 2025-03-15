import Contest from '../models/Contest.js';

export const getContests = async (req, res) => {
  try {
    const { platform } = req.query;
    let filter = {};

    if (platform) {
      filter.platform = { $in: platform.split(',') };
    }

    const contests = await Contest.find(filter).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
};
