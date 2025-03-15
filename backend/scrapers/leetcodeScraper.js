import axios from "axios";

const fetchLeetcodeContests = async () => {
  try {
    const response = await axios.get("https://leetcode.com/contest/api/list/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    console.log("LeetCode API Response:", response.data);

    if (!response.data || !response.data.contests) {
      throw new Error("Invalid response format from LeetCode API");
    }

    return response.data.contests.map((contest) => {
      const startTime = contest.start_time ? new Date(contest.start_time * 1000) : null;
      const endTime = contest.start_time ? new Date((contest.start_time + contest.duration) * 1000) : null;

      if (!startTime || !endTime) {
        console.warn("⚠️ Skipping invalid contest:", contest);
        return null;
      }

      return {
        name: contest.title,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
        start_time: startTime,
        end_time: endTime,
        platform: "LeetCode",
      };
    }).filter(Boolean);
  } catch (error) {
    console.error("❌ Error fetching LeetCode contests:", error.message);
    return [];
  }
};

export default fetchLeetcodeContests;
