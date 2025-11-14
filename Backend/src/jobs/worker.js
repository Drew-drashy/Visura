import "dotenv/config.js";
import axios from "axios";
import { videoQueue } from "./queue.js";
import Video from "../models/Video.js";
import { connectMongo } from "../config/mongo.js";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const CONCURRENCY = Number(process.env.VIDEO_WORKER_CONCURRENCY || 2);

(async () => {
  await connectMongo();
  console.log("Video worker starting…");

  videoQueue.process("generate-video", CONCURRENCY, async (job) => {
    const { jobId, prompt } = job.data;
    console.log(`Processing job ${jobId} with prompt:`, prompt);

    try {
      await Video.findByIdAndUpdate(jobId, { status: "processing" });

      await axios.post(`${AI_URL}/generate_video_veo`, {
        jobId,
        prompt,
      });

      return { ok: true };
    } catch (err) {
      console.error(
        "Worker error for job",
        jobId,
        err?.response?.data || err.message
      );
      await Video.findByIdAndUpdate(jobId, {
        status: "failed",
        error: err.message,
      });
      throw err; 
    }
  });

  videoQueue.on("completed", (job) => {
    console.log(`Job ${job.id} completed (AI request sent).`);
  });

  videoQueue.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
  });
})();