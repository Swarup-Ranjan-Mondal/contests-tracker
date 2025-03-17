const { fetchAndStoreAllPlaylists } = require("./src/dataHandler");

async function main() {
    console.log("🚀 Fetching YouTube playlists...");
    await fetchAndStoreAllPlaylists();
    console.log("✅ All playlists have been processed and stored.");
}

main();
