import dotenv from "dotenv";

dotenv.config();

// Checking required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export { MONGO_URI, JWT_SECRET };
