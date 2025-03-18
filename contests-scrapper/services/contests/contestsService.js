import fetchCodeforcesContests from "../../scrapers/codeforcesScraper.js";
import fetchCodeChefContests from "../../scrapers/codechefScraper.js";
import fetchLeetcodeContests from "../../scrapers/leetcodeScraper.js";
import Contest from "../../models/Contest.js";

const contestsService = async () => {
  try {
    console.log("🔍 Fetching contests...");

    // Fetch contests from each platform with error handling
    const [codeforces, codechef, leetcode] = await Promise.all([
      fetchCodeforcesContests().catch((err) => {
        console.error("❌ Error fetching Codeforces:", err);
        return [];
      }),
      fetchCodeChefContests().catch((err) => {
        console.error("❌ Error fetching CodeChef:", err);
        return [];
      }),
      fetchLeetcodeContests().catch((err) => {
        console.error("❌ Error fetching LeetCode:", err);
        return [];
      }),
    ]);

    console.log("✅ Codeforces Contests:", codeforces.length, "contests");
    console.log("✅ CodeChef Contests:", codechef.length, "contests");
    console.log("✅ LeetCode Contests:", leetcode.length, "contests");

    // If all arrays are empty, return early
    if (
      codeforces.length === 0 &&
      codechef.length === 0 &&
      leetcode.length === 0
    ) {
      console.warn("⚠️ No contests fetched from any platform.");
      return;
    }

    // Combine all contests
    let allContests = [...codeforces, ...codechef, ...leetcode];

    // Debugging: Log invalid date formats before filtering
    allContests.forEach((contest, index) => {
      if (!contest.start_time || !contest.end_time) {
        console.warn(
          `⚠️ Missing date fields in contest at index ${index}:`,
          contest
        );
      } else if (
        isNaN(new Date(contest.start_time)) ||
        isNaN(new Date(contest.end_time))
      ) {
        console.warn(
          `⚠️ Invalid date format in contest at index ${index}:`,
          contest
        );
      }
    });

    // Validate contests & remove invalid ones
    allContests = allContests
      .filter((contest, index) => {
        if (
          !contest.start_time ||
          !contest.end_time ||
          isNaN(new Date(contest.start_time).getTime()) ||
          isNaN(new Date(contest.end_time).getTime())
        ) {
          console.error(
            `❌ Skipping invalid contest at index ${index}:`,
            contest
          );
          return false;
        }
        return true;
      })
      .map((contest) => ({
        name: contest.name,
        platform: contest.platform,
        url: contest.url,
        startTime: new Date(contest.start_time), // Ensure Date format
        endTime: new Date(contest.end_time),
      }));

    console.log("📊 Total valid contests after filtering:", allContests.length);

    if (allContests.length === 0) {
      console.warn("⚠️ No valid contests left after filtering.");
      return;
    }

    // Clear existing contests in the database
    await Contest.deleteMany({});
    console.log("🗑️ Existing contests deleted.");

    // Insert new contests
    await Contest.insertMany(allContests);
    console.log("✅ Contests updated successfully.");
  } catch (error) {
    console.error("❌ Error in fetchAllContests:", error);
  }
};

export default contestsService;
