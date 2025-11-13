# utils/db.py
import os
from typing import Optional
from pymongo import MongoClient
from pymongo.collection import Collection

_client: Optional[MongoClient] = None
_coll: Optional[Collection] = None

def get_collection() -> Optional[Collection]:
    global _client, _coll
    uri = os.getenv("MONGODB_URI")
    if not uri:
        return None
    if _client is None:
        _client = MongoClient(uri)
    db_name = os.getenv("MONGO_DB", "ai_video")
    coll_name = os.getenv("MONGO_JOBS_COLLECTION", "video_jobs")
    _coll = _client[db_name][coll_name]
    return _coll

def upsert_job_status(job_id: str, status: str, data: Optional[dict] = None) -> None:
    """
    Best-effort status logging. No exceptions bubble up to API.
    """
    try:
        coll = get_collection()
        if coll is None:            # <-- key change; no truthiness on Collection
            return
        update = {"$set": {"status": status}}
        if data:
            update["$set"].update(data)
        coll.update_one({"_id": job_id}, update, upsert=True)
    except Exception:
        # swallow logging errors; main pipeline must not fail because of logging
        pass
