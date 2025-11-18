// src/config/mongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
    });
    isConnected = true;
    console.log("MongoDB connected (worker/server)");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // fail fast, let PM2 / Docker restart
  }
}

export default mongoose;
