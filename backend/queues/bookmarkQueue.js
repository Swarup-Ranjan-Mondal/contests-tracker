import { Queue } from "bullmq";

const bookmarkQueue = new Queue("bookmarkQueue", {
  connection: { host: "localhost", port: 6379 },
});

export default bookmarkQueue;
