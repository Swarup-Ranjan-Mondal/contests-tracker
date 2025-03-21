import connectDB from "./services/db/connectDB.js";
import redisClient from "./services/redis/redisClient.js";
import "./queue/worker.js";

const startService = async () => {
  try {
    await connectDB();
    await redisClient.connect();
    console.log("Redis connected");
    console.log("Contest Reminder Service is running...");
  } catch (error) {
    console.error("Error starting service:", error);
    process.exit(1);
  }
};

startService();
