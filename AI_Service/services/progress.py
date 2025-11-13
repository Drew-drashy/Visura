import os
import requests
from utils.db import upsert_job_status

def set_status(job_id: str, status: str, data: dict | None = None):
    upsert_job_status(job_id, status, data)

def notify_webhook(job_id: str, payload: dict):
    url = os.getenv("WEBHOOK_URL")
    if not url:
        return
    try:
        requests.post(url, json={"jobId": job_id, **payload}, timeout=10)
    except Exception:
        pass
