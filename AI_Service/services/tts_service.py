import os

def synthesize_voice(text: str, out_path: str) -> str:
    """
    Default: stub (silent mp3). You can swap to Google Cloud TTS:
    - set TTS_PROVIDER=gcloud
    - install: pip install google-cloud-texttospeech
    - ensure ADC credentials: gcloud auth application-default login
    """
    provider = os.getenv("TTS_PROVIDER", "stub").lower()

    if provider == "gcloud":
        try:
            from google.cloud import texttospeech
        except Exception as e:
            raise RuntimeError("google-cloud-texttospeech not installed") from e

        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US", name="en-US-Standard-C"
        )
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
        with open(out_path, "wb") as f:
            f.write(response.audio_content)
        return out_path

    # stub: silent audio
    with open(out_path, "wb") as f:
        f.write(b"")
    return out_path
