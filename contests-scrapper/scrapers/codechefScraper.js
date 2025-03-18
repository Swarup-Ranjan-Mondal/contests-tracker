import axios from "axios";

const fetchCodeChefContests = async () => {
  try {
    const response = await axios.get("https://www.codechef.com/api/list/contests/all");

    if (!response.data || (!response.data.future_contests && !response.data.present_contests && !response.data.past_contests)) {
      throw new Error("Invalid response format from CodeChef API");
    }

    // Merge present, past & future contests
    const contests = [...(response.data.future_contests || []), ...(response.data.present_contests || []), ...(response.data.past_contests || [])];

    return contests.map((contest) => ({
      name: contest.contest_name,
      url: `https://www.codechef.com/${contest.contest_code}`,
      start_time: new Date(Date.parse(contest.contest_start_date_iso)), // Ensure correct date format
      end_time: new Date(Date.parse(contest.contest_end_date_iso)),
      platform: "codechef",
    }));
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error.message);
    return [];
  }
};

export default fetchCodeChefContests;
