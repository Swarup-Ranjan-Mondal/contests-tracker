import axios from "axios";

const fetchCodeChefContests = async () => {
  try {
    const response = await axios.get("https://www.codechef.com/api/list/contests/all");
    console.log("CodeChef API Response:", response.data);

    if (!response.data || !response.data.future_contests) {
      throw new Error("Invalid response format from CodeChef API");
    }

    return response.data.future_contests.map((contest) => ({
      name: contest.contest_name,
      url: `https://www.codechef.com/${contest.contest_code}`,
      start_time: new Date(contest.start_date_iso),
      end_time: new Date(contest.end_date_iso),
      platform: "CodeChef",
    }));
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error.message);
    return [];
  }
};

export default fetchCodeChefContests;
