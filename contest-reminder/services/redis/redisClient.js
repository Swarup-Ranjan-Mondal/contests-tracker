import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from "../../config/config.js";

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

export default redisClient;
