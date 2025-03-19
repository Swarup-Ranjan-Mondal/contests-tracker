import axios from "axios";

const CODECHEF_BASE_URL = "https://www.codechef.com/";
const CODECHEF_API = "https://www.codechef.com/api/list/contests/all";

const fetchCodeChefContests = async () => {
  try {
    console.log("🔎 Fetching CodeChef contests...");

    const response = await axios.get(CODECHEF_API);

    if (
      !response.data ||
      (!response.data.future_contests &&
        !response.data.present_contests &&
        !response.data.past_contests)
    ) {
      throw new Error("Invalid response format from CodeChef API");
    }

    const contests = [
      ...(response.data.future_contests || []),
      ...(response.data.present_contests || []),
      ...(response.data.past_contests || []),
    ];

    console.log(`✅ Fetched ${contests.length} CodeChef contests`);

    return contests.map((contest) => ({
      name: contest.contest_name,
      url: `${CODECHEF_BASE_URL}${contest.contest_code}`,
      start_time: new Date(Date.parse(contest.contest_start_date_iso)),
      end_time: new Date(Date.parse(contest.contest_end_date_iso)),
      platform: "codechef",
    }));
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error.message);
    return [];
  }
};

export default fetchCodeChefContests;
