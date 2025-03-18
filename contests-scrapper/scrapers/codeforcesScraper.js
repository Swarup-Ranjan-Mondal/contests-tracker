import axios from "axios";

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");

    if (!response.data || !response.data.result) {
      throw new Error("Invalid response format from Codeforces API");
    }

    // Define start date as January 1, 2023
    const startDate = new Date("2023-01-01T00:00:00Z").getTime() / 1000; // Convert to seconds

    // Filter contests from Jan 2023 onward
    const filteredContests = response.data.result.filter((contest) => contest.startTimeSeconds >= startDate);

    console.log(`✅ Fetched ${filteredContests.length} contests from Jan 2023 onwards.`);

    return filteredContests.map((contest) => ({
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
