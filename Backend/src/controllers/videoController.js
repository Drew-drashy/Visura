import Video from "../models/Video.js";
import { videoQueue } from "../jobs/queue.js";

export const generateVideo = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user._id;

    // 1) Create DB record
    const job = await Video.create({ userId, prompt, status: "queued" });

    // 2) Add to queue – DO NOT call AI service here
    await videoQueue.add("generate-video", {
      jobId: job._id.toString(),
      prompt,
      userId: userId.toString()
    });

    // 3) Respond immediately
    res.status(202).json({ jobId: job._id, status: "queued" });
  } catch (err) {
    console.error("generateVideo error:", err);
    res.status(500).json({ error: "Failed to enqueue video generation" });
  }
};
export const videoWebhook = async (req, res) => {
  try {
    const { jobId, status, video_url, storage_key, message } = req.body;

    const update = { status };
    if (video_url) update.videoUrl = video_url;
    if (storage_key) update.storageKey = storage_key;
    if (message && status === "failed") update.error = message;

    await Video.findByIdAndUpdate(jobId, update);
    return res.json({ ok: true });
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).json({ error: "Failed to update video job" });
  }
};

