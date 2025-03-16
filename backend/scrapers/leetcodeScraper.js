import axios from "axios";

const LEETCODE_BASE_URL = "https://leetcode.com/contest/";
const LEETCODE_API = "https://leetcode.com/graphql";

const fetchLeetcodeContests = async () => {
  try {
    const [upcomingResponse, pastResponse] = await Promise.all([
      axios.post(
        LEETCODE_API,
        {
          query: `{
            upcomingContests {
              title
              titleSlug
              startTime
              duration
            }
          }`,
        },
        { headers: { "Content-Type": "application/json" } }
      ),
      axios.post(
        LEETCODE_API,
        {
          operationName: "pastContests",
          query: `query pastContests($pageNo: Int, $numPerPage: Int) {
            pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
              data {
                title
                titleSlug
                startTime
                duration
              }
            }
          }`,
          variables: { pageNo: 1, numPerPage: 10 },
        },
        { headers: { "Content-Type": "application/json" } }
      ),
    ]);

    if (!upcomingResponse.data?.data?.upcomingContests && !pastResponse.data?.data?.pastContests?.data) {
      throw new Error("Invalid response format from LeetCode API");
    }

    const upcomingContests = upcomingResponse?.data?.data?.upcomingContests || [];
    const pastContests = pastResponse?.data?.data?.pastContests?.data || [];

    return [...upcomingContests, ...pastContests].map((contest) => ({
      name: contest.title,
      url: `${LEETCODE_BASE_URL}${contest.titleSlug}`,
      start_time: new Date(contest.startTime * 1000),
      end_time: new Date((contest.startTime + contest.duration) * 1000),
      platform: "leetcode",
    }));
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error.message);
    return [];
  }
};

export default fetchLeetcodeContests;
