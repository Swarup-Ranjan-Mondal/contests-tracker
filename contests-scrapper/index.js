import cron from "node-cron";
import connectDB from "./services/db/connectDB.js";
import contestsService from "./services/contests/contestsService.js";

// Main function to execute the process
async function executeTask() {
  try {
    await connectDB();
    console.log("🚀 Fetching Contest data...");

    contestsService();
  } catch (error) {
    console.error("❌ Error in execution:", error);
  }
}

// Run the function every 6 hours using cron
cron.schedule("0 */6 * * *", async () => {
  console.log("⏳ Running scheduled task to update contests...");
  await executeTask();
});

console.log("🕒 Cron job scheduled to run every 6 hours.");
