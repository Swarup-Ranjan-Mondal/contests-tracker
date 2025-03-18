import cron from "node-cron";
import connectDB from "./services/connectDB.js";
import contestsFetcher from "./services/contestsFetcher.js";

// Main function to execute the process
async function executeTask() {
  try {
    await connectDB();
    console.log("🚀 Fetching Contest data...");

    contestsFetcher();
  } catch (error) {
    console.error("❌ Error in execution:", error);
  }
}

// Run the function every minute using cron
cron.schedule("*/1 * * * *", async () => {
  console.log("⏳ Running scheduled task to update contests...");
  await executeTask();
});

console.log("🕒 Cron job scheduled to run every minute.");
