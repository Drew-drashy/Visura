import os
import google.generativeai as genai

def _configure():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY missing in env")
    genai.configure(api_key=api_key)

def generate_script_from_prompt(prompt: str) -> str:
    """
    Uses Gemini to produce a concise 10–12s narration for the prompt.
    """
    _configure()
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    model = genai.GenerativeModel(model_name)

    system = (
        "You are a concise script writer for 10–12 second short videos. "
        "Return a single-paragraph narration (2–4 sentences), no disclaimers."
    )
    # Gemini SDK expects just the prompt; we can prepend instructions
    content = f"{system}\n\nPrompt: {prompt}"
    resp = model.generate_content(content)
    text = (resp.text or "").strip()
    if not text:
        # fallback if no text returned
        text = f"This short video is about: {prompt}. Imagine vivid visuals and a calm narration."
    # trim long outputs
    return text[:700]
