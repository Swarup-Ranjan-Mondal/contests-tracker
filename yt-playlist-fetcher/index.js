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

    // Fetch past contests that ended before the current time
    const currentTime = moment().toISOString();
    const pastContests = await Contest.find({
        platform: new RegExp(`^${platform}$`, "i"),
        endTime: { $lt: currentTime }
    });

    console.log(`📢 Found ${pastContests.length} past contests for ${platform}.`);

    if (pastContests.length === 0) {
        console.log(`⚠️ No past contests found for ${platform}.`);
        return;
    }

    const videoList = videosData[platform] || [];
    console.log(`📢 Found ${videoList.length} videos for ${platform}.`);

    if (videoList.length === 0) {
        console.log(`⚠️ No videos found for ${platform}.`);
        return;
    }

    const updatedContests = await matchFunction(pastContests, videoList);

    // Update 'youtube_url' field in MongoDB for matched contests
    for (const contest of updatedContests) {
        if (contest.youtube_url) {
            await Contest.updateOne(
                { _id: contest._id }, // Match contest by ID
                { $set: { youtube_url: contest.youtube_url } } // Update YouTube URL
            );
            console.log(`✅ Updated '${contest.contest_name}' with YouTube URL: ${contest.youtube_url}`);
        }
    }

    console.log(`✅ Successfully updated ${updatedContests.filter(c => c.youtube_url).length} contests for ${platform}.`);
}

// Main function
async function main() {
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
        console.error("❌ Error in main execution:", error);
        process.exit(1);
    }
}

main();
