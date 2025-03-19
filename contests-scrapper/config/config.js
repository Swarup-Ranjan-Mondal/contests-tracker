import dotenv from "dotenv";

dotenv.config();

// Check MONGO_URI environment variable
if (!process.env.MONGO_URI) {
  console.error(`❌ MongoDB URI not found. Please add MONGO_URI in .env file.`);
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;

export { MONGO_URI };
