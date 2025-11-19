# services/veo_service.py
import os
import time
import tempfile
from pathlib import Path
from typing import Optional, List

import google.genai as genai
from google.genai import types


def _client() -> genai.Client:
    """
    Initialize Gemini/Veo client with API key from env.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY missing in environment")
    return genai.Client(api_key=api_key)


def generate_video_with_veo(
    prompt: str,
    image_paths: Optional[List[str]] = None,
    aspect_ratio: Optional[str] = None,      # "16:9" | "9:16"
    resolution: Optional[str] = None,        # "720p" | "1080p"
    duration_seconds: Optional[int] = None   # 4 | 6 | 8
) -> str:
    """
    Uses Veo 3.1 via the google.genai SDK to generate a video for the given prompt.
    Polls until the operation is done, downloads the video, and returns local file path.
    """

    client = _client()
    model = os.getenv("VEO_MODEL", "veo-3.1-generate-preview")

    # ---- Build config for Veo ----
    cfg_kwargs = {}
    if aspect_ratio:
        cfg_kwargs["aspect_ratio"] = aspect_ratio  # Python SDK uses snake_case
    if resolution:
        cfg_kwargs["resolution"] = resolution
    if duration_seconds:
        cfg_kwargs["duration_seconds"] = duration_seconds

    config = types.GenerateVideosConfig(**cfg_kwargs) if cfg_kwargs else None

    # ---- Prepare optional starting image (first in list) ----
    image_obj = None
    if image_paths:
        # Upload first image as a File and use as starting frame
        p = image_paths[0]
        uploaded = client.files.upload(filepath=p, display_name=Path(p).name)
        image_obj = uploaded.as_image()

    # ---- Start video generation ----
    print(">>> Veo: calling generate_videos with model:", model)
    operation = client.models.generate_videos(
        model=model,
        prompt=prompt,
        image=image_obj,
        config=config,
    )

    # ---- Poll until done ----
    while not operation.done:
        print(">>> Veo: waiting for video generation to complete...")
        time.sleep(10)
        operation = client.operations.get(operation)

    # ---- Check for errors ----
    if getattr(operation, "error", None):
        raise RuntimeError(f"Veo error: {operation.error}")

    if not operation.response or not getattr(operation.response, "generated_videos", None):
        raise RuntimeError(
            f"Veo operation finished but returned no videos: {operation.response}"
        )

    generated_video = operation.response.generated_videos[0]
    print(">>> Veo: generation finished, downloading file...")

    # ---- Download video file to temp path ----
    tmp_dir = Path(tempfile.mkdtemp(prefix="veo_"))
    out_path = tmp_dir / "veo_output.mp4"

    # This follows the official pattern:
    #   client.files.download(file=generated_video.video)
    #   generated_video.video.save("dialogue_example.mp4")
    try:
        client.files.download(file=generated_video.video)
        generated_video.video.save(str(out_path))
    except Exception as e:
        # Fallback: some versions may return a raw File; try download+write
        print(">>> Veo: download via save() failed, trying raw download:", e)
        blob = client.files.download(file=generated_video.video)
        try:
            data = blob.read()
        except Exception:
            data = blob
        out_path.write_bytes(data)

    print(f">>> Veo: video saved to {out_path}")
    return str(out_path)
