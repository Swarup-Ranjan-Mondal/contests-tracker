import { fetchAndStoreAllPlaylists } from "./src/dataHandler.js";
import connectDB from "./src/services/connectDB.js";

async function main() {
    try {
        await connectDB();
        console.log("🚀 Fetching YouTube playlists...");
        
        await fetchAndStoreAllPlaylists();
        
        console.log("✅ All playlists have been processed and stored.");
    } catch (error) {
        console.error("❌ Error in main execution:", error);
        process.exit(1);
    }
}

main();
