import "dotenv/config.js";
import axios from "axios";
import { videoQueue } from "./queue.js";
import Video from "../models/Video.js";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// optional: control how many parallel jobs you want
const CONCURRENCY = Number(process.env.VIDEO_WORKER_CONCURRENCY || 2);

console.log("Video worker starting…");

videoQueue.process("generate-video", CONCURRENCY, async (job) => {
  const { jobId, prompt } = job.data;
  console.log(`Processing job ${jobId} with prompt:`, prompt);

  try {
    // mark as processing
    await Video.findByIdAndUpdate(jobId, { status: "processing" });

    // call Python AI service (it will upload to Cloudinary and hit your webhook)
    await axios.post(`${AI_URL}/generate_video_veo`, {
      jobId,
      prompt
    });

    // Do NOT mark completed here — webhook will do that once video_url is ready
    return { ok: true };
  } catch (err) {
    console.error("Worker error for job", jobId, err?.response?.data || err.message);
    await Video.findByIdAndUpdate(jobId, {
      status: "failed",
      error: err.message
    });
    throw err; // let Bull handle retries / failed status
  }
});

videoQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed (AI service request sent).`);
});

videoQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
