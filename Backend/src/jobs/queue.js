import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

export const videoQueue = new Queue(
  "video-generation",
  process.env.REDIS_URL || "redis://127.0.0.1:6379"
);
