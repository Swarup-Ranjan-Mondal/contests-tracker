import axios from "axios";

const CODEFORCES_BASE_URL = "https://codeforces.com/contest/";
const CODEFORCES_API = "https://codeforces.com/api/contest.list";

const fetchCodeforcesContests = async () => {
  try {
    console.log("🔎 Fetching Codeforces contests...");

    const response = await axios.get(CODEFORCES_API);

    if (!response.data || !response.data.result) {
      throw new Error("Invalid response format from Codeforces API");
    }

    // Fetch contests after January 1, 2023
    const startDate = new Date("2023-01-01T00:00:00Z").getTime() / 1000;
    const filteredContests = response.data.result.filter(
      (contest) => contest.startTimeSeconds >= startDate
    );

    console.log(
      `✅ Fetched ${filteredContests.length} contests from Jan 2023 onwards.`
    );

    return filteredContests.map((contest) => ({
      name: contest.name,
      url: `${CODEFORCES_BASE_URL}${contest.id}`,
      start_time: new Date(contest.startTimeSeconds * 1000),
      end_time: new Date(
        (contest.startTimeSeconds + contest.durationSeconds) * 1000
      ),
      platform: "codeforces",
    }));
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error.message);
    return [];
  }
};

export default fetchCodeforcesContests;
