import os
import requests
from utils.db import upsert_job_status

def set_status(job_id: str, status: str, data: dict | None = None):
    upsert_job_status(job_id, status, data)

def notify_webhook(job_id: str, payload: dict):
    # 👇 default to port 5001 (your backend)
    url = os.getenv("WEBHOOK_URL", "http://localhost:5001/api/videos/webhook")
    body = {"jobId": job_id, **payload}
    try:
        print(">>> calling webhook:", url, "payload:", body)
        resp = requests.post(url, json=body, timeout=10)
        print(">>> webhook response:", resp.status_code, resp.text)
        resp.raise_for_status()
    except Exception as e:
        print("!!! webhook error:", e)
