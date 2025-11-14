import express from "express";
import { generateVideo, videoWebhook } from "../controllers/videoController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", authRequired, generateVideo);
router.post("/webhook", videoWebhook);

export default router;
