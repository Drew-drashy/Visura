import mongoose from "mongoose";

const oAuthAccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },         // "google"
    providerUserId: { type: String, required: true },   // Google "sub"
    email: { type: String },                            // convenience copy
  },
  { timestamps: true }
);

oAuthAccountSchema.index({ provider: 1, providerUserId: 1 }, { unique: true });

export default mongoose.model("OAuthAccount", oAuthAccountSchema);
