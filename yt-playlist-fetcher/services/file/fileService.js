import fs from "fs";
import path from "path";
import { DATA_STORE_PATH } from "../../config/config.js";

// Make 'data' folder if data folder doesn't exist
if (!fs.existsSync(DATA_STORE_PATH)) {
  fs.mkdirSync(DATA_STORE_PATH, { recursive: true });
}

const getDataFilePath = (playlistName) => path.join(DATA_STORE_PATH, `${playlistName}.json`);

const isDataAvailable = (playlistName) => fs.existsSync(getDataFilePath(playlistName));

const readStoredData = (playlistName) => {
  const filePath = getDataFilePath(playlistName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const saveToJsonFile = (playlistName, videos) => {
  const filePath = getDataFilePath(playlistName);
  fs.writeFileSync(filePath, JSON.stringify(videos, null, 2), "utf-8");
};

export { isDataAvailable, readStoredData, saveToJsonFile };
