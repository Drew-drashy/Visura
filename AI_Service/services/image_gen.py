import tempfile
from pathlib import Path
from PIL import Image, ImageDraw

def generate_frames_from_prompt(prompt: str, count: int = 10) -> list[str]:
    """
    Stubbed frame generator.
    Replace with real frames from your model provider (Stability, Fal, Replicate).
    """
    tempdir = Path(tempfile.mkdtemp(prefix="frames_"))
    paths = []
    for i in range(count):
        p = tempdir / f"frame_{i:03d}.png"
        img = Image.new("RGB", (720, 1280), (15*i % 255, 70, 110))
        d = ImageDraw.Draw(img)
        d.text((40, 40), f"{prompt}\nFrame {i+1}", fill=(255, 255, 255))
        img.save(p)
        paths.append(str(p))
    return paths
