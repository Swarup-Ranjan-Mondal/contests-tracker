import cron from "node-cron";
import { fetchAndStoreAllPlaylists } from "./src/dataHandler.js";
import connectDB from "./src/services/connectDB.js";
import Contest from "./models/Contest.js";
import moment from "moment";
import { matchCodeforcesContestsWithVideos } from "./src/comparators/codeforcesComparator.js";
import { matchCodeChefContestsWithVideos } from "./src/comparators/codechefComparator.js";
import { matchLeetCodeContestsWithVideos } from "./src/comparators/leetcodeComparator.js";

// Function to update past contests for a specific platform
async function updateContestsWithVideos(platform, matchFunction, videosData) {
    console.log(`\n🔍 Fetching past contests for ${platform}...`);

    const currentTime = moment().toISOString();
    const pastContests = await Contest.find({
        platform: platform?.toLowerCase(),
        endTime: { $lt: currentTime }
    });

    console.log(`📢 Found ${pastContests.length} past contests for ${platform}.`);

    if (pastContests.length === 0) return;

    const videoList = videosData[platform] || [];
    console.log(`📢 Found ${videoList.length} videos for ${platform}.`);

    if (videoList.length === 0) return;

    const updatedContests = await matchFunction(pastContests, videoList);

    for (const contest of updatedContests) {
        if (contest.youtube_url) {
            await Contest.updateOne({ _id: contest._id }, { $set: { youtube_url: contest.youtube_url } });
            console.log(`✅ Updated '${contest._id}' with YouTube URL: ${contest.youtube_url}`);
        }
    }

    console.log(`✅ Successfully updated ${updatedContests.filter(c => c.youtube_url).length} contests for ${platform}.`);
}

// Main function to execute the process
async function executeTask() {
    try {
        await connectDB();
        console.log("🚀 Fetching YouTube playlists...");

        const videosData = await fetchAndStoreAllPlaylists();

        console.log("🔄 Matching YouTube videos with past contests...");

        await updateContestsWithVideos("codeforces", matchCodeforcesContestsWithVideos, videosData);
        await updateContestsWithVideos("codechef", matchCodeChefContestsWithVideos, videosData);
        await updateContestsWithVideos("leetcode", matchLeetCodeContestsWithVideos, videosData);

        console.log("✅ All past contests updated with matching YouTube video URLs.");
    } catch (error) {
        console.error("❌ Error in execution:", error);
    }
}

// Run the function every minute using cron
cron.schedule("*/1 * * * *", async () => {
    console.log("⏳ Running scheduled task to update contests...");
    await executeTask();
});

console.log("🕒 Cron job scheduled to run every minute.");
