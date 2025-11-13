import subprocess
from pathlib import Path

def compose_video_from_frames_audio(frames: list[str], audio_path: str, out_path: str, fps: int = 6) -> str:
    """
    Use ffmpeg to create a video from frames + voiceover.
    """
    # ffmpeg with image2 sequence is simplest if names are sequential:
    # Build a text list to avoid shell escape issues
    list_file = Path(out_path).with_suffix(".txt")
    with open(list_file, "w") as f:
        for fr in frames:
            f.write(f"file '{fr}'\n")

    cmd = [
        "ffmpeg","-y",
        "-r", str(fps),
        "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-i", audio_path,
        "-vf", "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=black",
        "-shortest",
        "-pix_fmt", "yuv420p",
        out_path
    ]
    subprocess.run(cmd, check=True)
    return out_path
