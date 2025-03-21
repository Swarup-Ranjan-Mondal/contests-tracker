import { Worker } from "bullmq";
import scheduleReminder from "../services/reminder/scheduleReminder.js";
import { REDIS_HOST, REDIS_PORT } from "../config/config.js";

const bookmarkWorker = new Worker(
  "bookmarkQueue",
  async (job) => {
    const { userId, contestId } = job.data;
    console.log(
      `Processing bookmark for User: ${userId}, Contest: ${contestId}`
    );

    await scheduleReminder(userId, contestId);
  },
  {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
  }
);

console.log("Bookmark Worker started!");
