import Video from "../models/Video.js";
import { videoQueue } from "../jobs/queue.js";
import User from "../models/User.js";

export const generateVideo = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;
    const userDoc=await  User.findById(userId).select('credits');
    if(!userDoc){
      return res.status(400).json({message: 'User not found'});
    }
    const credit=userDoc?.credits;
    if(credit<=0){
      return res.status(403).json({message: 'No Credits Left'});
    }
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
    console.log('hiiiii im webhookkkkk')
    const { jobId, status, video_url, storage_key, message } = req.body;
    const update = { status };
    if (video_url) update.videoUrl = video_url;
    if (storage_key) update.storageKey = storage_key;
    if (message && status === "failed") update.error = message;

    await Video.findByIdAndUpdate(jobId, update);
    const userId=Video?.userId;
    await User.findByIdAndUpdate(userId,{$inc: {credits:-1}});
    return res.status(200).json({message: 'Video has been '});
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).json({ error: "Failed to update video job" });
  }
};

export const getVideo = async (req, res) => {
  try {
    const videoJobId = req.params.id;
    if (!videoJobId) {
      return res.status(400).json({ message: "Video ID is required." });
    }
    const job = await Video.findById(videoJobId);

    if (!job) {
      return res.status(404).json({ message: "Video job not found." });
    }
    return res.status(200).json(job);
  } catch (err) {
    console.error("videoById error:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching video job.", error: err.message });
  }
};

export const listMyVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const videos = await Video.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: videos.length,
      videos
    });
  } catch (err) {
    console.error("listMyVideos error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch user videos", error: err.message });
  }
};