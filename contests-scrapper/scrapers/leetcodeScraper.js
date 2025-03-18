import axios from "axios";

const LEETCODE_BASE_URL = "https://leetcode.com/contest/";
const LEETCODE_API = "https://leetcode.com/graphql";

const fetchLeetcodeContests = async () => {
  try {
    console.log("🔎 Fetching LeetCode contests...");

    // ✅ Fetch upcoming contests
    const upcomingResponse = await axios.post(
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
    );

    const upcomingContests = upcomingResponse?.data?.data?.upcomingContests || [];
    console.log(`✅ Fetched ${upcomingContests.length} upcoming contests`);

    // ✅ Fetch past contests (5 pages)
    const pastContests = [];
    const numPerPage = 20; // Number of contests per page

    for (let pageNo = 1; pageNo <= 10; pageNo++) {
      console.log(`📦 Fetching page ${pageNo} of past contests...`);

      const pastResponse = await axios.post(
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
          variables: { pageNo, numPerPage },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const contests = pastResponse?.data?.data?.pastContests?.data || [];

      if (contests.length === 0) {
        console.warn(`⚠️ No more contests found on page ${pageNo}.`);
        break; // Stop if no more contests are available
      }

      pastContests.push(...contests);
      console.log(`✅ Fetched ${contests.length} contests from page ${pageNo}`);
    }

    console.log(`📊 Total past contests fetched: ${pastContests.length}`);

    // ✅ Combine and format contests
    const allContests = [...upcomingContests, ...pastContests].map((contest) => ({
      name: contest.title,
      url: `${LEETCODE_BASE_URL}${contest.titleSlug}`,
      start_time: new Date(contest.startTime * 1000),
      end_time: new Date((contest.startTime + contest.duration) * 1000),
      platform: "leetcode",
    }));

    console.log(`📦 Total contests (Upcoming + Past): ${allContests.length}`);
    return allContests;
  } catch (error) {
    console.error("❗ Error fetching LeetCode contests:", error.message);
    return [];
  }
};

export default fetchLeetcodeContests;
