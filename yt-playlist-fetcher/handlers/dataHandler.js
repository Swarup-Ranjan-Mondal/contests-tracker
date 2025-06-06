import { YT_PLAYLIST_ID_MAP } from "../config/config.js";
import getPlaylistVideos from "../services/youtube/youtubeService.js";
import {
  isDataAvailable,
  readStoredData,
  saveToJsonFile,
} from "../services/file/fileService.js";

export async function fetchAndStorePlaylist(playlistName) {
  // if (isDataAvailable(playlistName)) {
  //   console.log(`📂 Using cached data for ${playlistName}...`);
  //   return readStoredData(playlistName);
  // }

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

export async function fetchAndStoreAllPlaylists() {
  const playlists = Object.keys(YT_PLAYLIST_ID_MAP);
  const allVideosData = {};

  for (const playlist of playlists) {
    allVideosData[playlist] = await fetchAndStorePlaylist(playlist);
  }

  return allVideosData;
}
