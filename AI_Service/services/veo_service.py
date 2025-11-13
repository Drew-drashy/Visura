# services/veo_service.py
import os
import time
import tempfile
from pathlib import Path
from typing import Optional, List

import google.genai as genai
from google.genai import types

def _client() -> genai.Client:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY missing")
    return genai.Client(api_key=api_key)

def generate_video_with_veo(
    prompt: str,
    image_paths: Optional[List[str]] = None,
    aspect_ratio: Optional[str] = None,
    resolution: Optional[str] = None,
    duration_seconds: Optional[int] = None
) -> str:
    client = _client()
    model = os.getenv("VEO_MODEL", "veo-3.1-generate-preview")

    cfg_kwargs = {}
    if aspect_ratio:      cfg_kwargs["aspect_ratio"] = aspect_ratio
    if resolution:        cfg_kwargs["resolution"] = resolution
    if duration_seconds:  cfg_kwargs["duration_seconds"] = duration_seconds

    image_parts = None
    if image_paths:
        image_parts = []
        for p in image_paths:
            f = client.files.upload(filepath=p, display_name=Path(p).name)
            image_parts.append(f.as_image())

    operation = client.models.generate_videos(
        model=model,
        prompt=prompt,
        image=image_parts[0] if image_parts else None,
        config=types.GenerateVideosConfig(**cfg_kwargs) if cfg_kwargs else None,
    )

    while not operation.done:
        time.sleep(10)
        operation = client.operations.get(operation)

    if not operation.response or not getattr(operation.response, "generated_videos", None):
        detail = getattr(operation, "error", None) or getattr(operation, "response", None)
        raise RuntimeError(f"Veo operation failed or returned no videos: {detail}")

    vid = operation.response.generated_videos[0]
    tmp_dir = Path(tempfile.mkdtemp(prefix="veo_"))
    out_path = tmp_dir / "veo_output.mp4"

    # Prefer SDK helpers; fallback to raw download if needed
    try:
        client.files.download(file=vid.video)
        vid.video.save(str(out_path))
    except Exception:
        blob = client.files.download(file=vid.video)
        try:
            data = blob.read()
        except Exception:
            data = blob
        out_path.write_bytes(data)

    return str(out_path)
