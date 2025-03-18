import axios from "axios";
import { YT_API_KEY, YT_API_URL } from "../../config/config.js";

async function getPlaylistVideos(playlistId) {
  let videos = [];
  let nextPageToken = null;

  try {
    while (true) {
      const response = await axios.get(YT_API_URL, {
        params: {
          part: "snippet",
          maxResults: 50,
          playlistId,
          key: YT_API_KEY,
          pageToken: nextPageToken,
        },
      });

      const data = response.data;
      videos.push(
        ...data.items.map((item) => ({
          title: item.snippet.title,
          video_id: item.snippet.resourceId.videoId,
          video_url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
          description: item.snippet.description.replace(/\n/g, " "),
          thumbnail: item.snippet.thumbnails.high.url,
          published_at: item.snippet.publishedAt,
        }))
      );

      nextPageToken = data.nextPageToken;
      if (!nextPageToken) break;
    }
  } catch (error) {
    console.error("❌ Error fetching playlist videos:", error.message);
  }

  return videos;
}

export default getPlaylistVideos;  // ✅ Use ES Module export
