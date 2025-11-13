# main.py (only the new parts shown; keep your existing imports)
import os, tempfile
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

from services.veo_service import generate_video_with_veo
from services.storage import upload_video
from services.progress import set_status, notify_webhook

load_dotenv()
app = FastAPI(title="AI Video Service (Gemini + Veo)", version="1.1.0")

class VeoRequest(BaseModel):
    jobId: str
    prompt: str
    imagePaths: Optional[List[str]] = None
    aspectRatio: Optional[str] = None    # "16:9" | "9:16"
    resolution: Optional[str] = None     # "720p" | "1080p"
    durationSeconds: Optional[int] = None # 4 | 6 | 8

class GenerateResponse(BaseModel):
    jobId: str
    status: str
    video_url: Optional[str] = None
    storage_key: Optional[str] = None
    message: Optional[str] = None

@app.post("/generate_video_veo", response_model=GenerateResponse)
def generate_video_veo(req: VeoRequest):
    job_id = req.jobId
    try:
        set_status(job_id, "processing", {"step": "veo:start"})
        aspect = req.aspectRatio or os.getenv("VEO_ASPECT_RATIO")
        res = req.resolution or os.getenv("VEO_RESOLUTION")
        dur = req.durationSeconds or (int(os.getenv("VEO_DURATION_SECONDS", "8")))

        local_path = generate_video_with_veo(
            prompt=req.prompt,
            image_paths=req.imagePaths,
            aspect_ratio=aspect,
            resolution=res,
            duration_seconds=dur
        )

        set_status(job_id, "processing", {"step": "upload"})
        video_url, storage_key = upload_video(local_path)

        payload = {"status":"completed","video_url":video_url,"storage_key":storage_key}
        set_status(job_id, "completed", payload)
        notify_webhook(job_id, payload)

        return GenerateResponse(jobId=job_id, status="completed", video_url=video_url, storage_key=storage_key)
    except Exception as e:
        err = {"status":"failed","error":str(e)}
        set_status(job_id, "failed", err)
        notify_webhook(job_id, err)
        return GenerateResponse(jobId=job_id, status="failed", message=str(e))
