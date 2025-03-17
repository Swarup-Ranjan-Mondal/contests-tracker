require("dotenv").config();
const fs = require("fs");
const path = require("path");

const YT_API_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const DATA_STORE_PATH = path.resolve(__dirname, "../data/");

// Checking required environment variables are set
const requiredEnvVars = ["YOUTUBE_API_KEY", "CODEFORCES_YT_PLAYLIST_ID", "CODECHEF_YT_PLAYLIST_ID", "LEETCODE_YT_PLAYLIST_ID"];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
}

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

// Youtube Playlist ID mapping
const YT_PLAYLIST_ID_MAP = {
    codeforces: process.env.CODEFORCES_YT_PLAYLIST_ID,
    codechef: process.env.CODECHEF_YT_PLAYLIST_ID,
    leetcode: process.env.LEETCODE_YT_PLAYLIST_ID,
};

// Creating data directory if doesn't exists
if (!fs.existsSync(DATA_STORE_PATH)) {
    fs.mkdirSync(DATA_STORE_PATH, { recursive: true });
}

module.exports = {
    YT_API_KEY,
    YT_API_URL,
    YT_PLAYLIST_ID_MAP,
    DATA_STORE_PATH,
};
