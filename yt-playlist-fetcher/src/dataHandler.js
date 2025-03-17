const { YT_PLAYLIST_ID_MAP } = require("./config");
const getPlaylistVideos = require("./services/youtubeService");
const { isDataAvailable, readStoredData, saveToJsonFile } = require("./services/fileService");

async function fetchAndStorePlaylist(playlistName) {
    if (isDataAvailable(playlistName)) {
        console.log(`📂 Using cached data for ${playlistName}...`);
        return readStoredData(playlistName);
    }

    console.log(`📥 Fetching new data for ${playlistName} from YouTube API...`);
    const videos = await getPlaylistVideos(YT_PLAYLIST_ID_MAP[playlistName]);

    if (videos.length > 0) {
        saveToJsonFile(playlistName, videos);
        console.log(`✅ Data for ${playlistName} saved.`);
        return videos;
    } else {
        console.warn(`❌ No videos found for ${playlistName}.`);
        return [];
    }
}

async function fetchAndStoreAllPlaylists() {
    const playlists = Object.keys(YT_PLAYLIST_ID_MAP);

    for (const playlist of playlists) {
        await fetchAndStorePlaylist(playlist);
    }
}

module.exports = {
    fetchAndStorePlaylist,
    fetchAndStoreAllPlaylists,
};
