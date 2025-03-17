import { fetchAndStoreAllPlaylists } from "./src/dataHandler.js";
import connectDB from "./src/services/connectDB.js";
import Contest from "./models/Contest.js";
import moment from "moment";
import { matchCodeforcesContestsWithVideos } from "./src/comparators/codeforcesComparator.js";

// Update past contests with YouTube URLs
async function updateContestsWithVideos(videosData) {
    const platform = "codeforces";  
    console.log(`\n🔍 Fetching past contests for ${platform}...`);

    // Fetch past Codeforces contests (contests that ended before the current time)
    const currentTime = moment().toISOString();
    const pastContests = await Contest.find({
        platform: new RegExp(`^${platform}$`, "i"),
        endTime: { $lt: currentTime }
    });

    console.log(`📢 Found ${pastContests.length} past contests.`);

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

    const updatedContests = await matchCodeforcesContestsWithVideos(pastContests, videoList);
    console.log(`✅ Updated ${updatedContests.length} contests for ${platform}.`);
}

// Main function
async function main() {
    try {
        await connectDB();
        console.log("🚀 Fetching YouTube playlists...");

        const videosData = await fetchAndStoreAllPlaylists();

        console.log("🔄 Matching YouTube videos with past Codeforces contests...");
        await updateContestsWithVideos(videosData);

        console.log("✅ Past Codeforces contests updated with matching YouTube video URLs.");
    } catch (error) {
        console.error("❌ Error in main execution:", error);
        process.exit(1);
    }
}

main();
