import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prompt: { type: String, required: true },
  status: { type: String, enum: ["queued", "processing", "completed", "failed"], default: "queued" },
  videoUrl: String,
  storageKey: String,
  error: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

videoSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Video", videoSchema);
