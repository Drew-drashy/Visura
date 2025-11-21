import express from "express";
import { generateVideo, videoWebhook, getVideo, listMyVideos, streamMyVideos } from "../controllers/videoController.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.post("/webhook", videoWebhook);
router.post("/generate", authRequired, generateVideo);
router.post('/:id',authRequired,getVideo);
router.get("/", authRequired, listMyVideos);
router.get("/stream", authRequired, streamMyVideos);

export default router;
