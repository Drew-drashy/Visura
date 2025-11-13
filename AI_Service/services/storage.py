import os
import cloudinary
import cloudinary.uploader
from pathlib import Path

def upload_video(local_path: str):
    """
    Uploads a local video file to Cloudinary and returns its secure URL + public ID.
    """
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

    response = cloudinary.uploader.upload(
        local_path,
        resource_type="video",        # handles mp4, mov, webm, etc.
        folder="ai_videos"            # optional folder in your account
    )

    url = response.get("secure_url")
    public_id = response.get("public_id")
    # remove the temp file if desired
    Path(local_path).unlink(missing_ok=True)
    return url, public_id
