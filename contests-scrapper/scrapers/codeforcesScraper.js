import axios from "axios";

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");

    if (!response.data || !response.data.result) {
      throw new Error("Invalid response format from Codeforces API");
    }

    return response.data.result.map((contest) => ({
      name: contest.name,
      url: `https://codeforces.com/contest/${contest.id}`,
      start_time: new Date(contest.startTimeSeconds * 1000),
      end_time: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
      platform: "codeforces",
    }));
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error.message);
    return [];
  }
};

export default fetchCodeforcesContests;
