const fs = require("fs");
const path = require("path");
const { DATA_STORE_PATH } = require("../config");

// Ensure data directory exists
if (!fs.existsSync(DATA_STORE_PATH)) {
    fs.mkdirSync(DATA_STORE_PATH, { recursive: true });
}

function getDataFilePath(playlistName) {
    return path.join(DATA_STORE_PATH, `${playlistName}.json`);
}

function isDataAvailable(playlistName) {
    return fs.existsSync(getDataFilePath(playlistName));
}

function readStoredData(playlistName) {
    const filePath = getDataFilePath(playlistName);
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveToJsonFile(playlistName, videos) {
    const filePath = getDataFilePath(playlistName);
    fs.writeFileSync(filePath, JSON.stringify(videos, null, 2), "utf-8");
}

module.exports = {
    isDataAvailable,
    readStoredData,
    saveToJsonFile,
};
