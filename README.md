# Visura

Full-stack AI video generation workspace that combines a React + Vite frontend, an Express/Mongo/Redis backend for auth and job orchestration, and a FastAPI service that calls Google's Veo model and uploads finished renders to Cloudinary.

## Repository Layout
- `Frontend/` – React 19 + TypeScript + MUI UI for auth, prompt-to-video creation, live status via SSE, and media library playback.
- `Backend/` – Express API for auth (JWT + refresh tokens, Google OAuth, password reset), credit tracking, video job creation, webhooks, and Bull queue/worker powered by Redis.
- `AI_Service/` – FastAPI service that invokes Veo through the `google-generativeai` SDK, stores job status, uploads results to Cloudinary, and posts webhooks back to the backend.

## High-Level Flow
1. User signs up/logs in (JWT) and submits a prompt from the UI.
2. Backend stores a `Video` document (`queued`), enqueues work to Redis via Bull, and returns a job id.
3. Worker consumes the queue, marks the job `processing`, and calls `AI_SERVICE_URL/generate_video_veo` with the prompt.
4. AI service generates via Veo, uploads the MP4 to Cloudinary, and notifies the backend webhook with `completed`/`failed` status.
5. Backend updates the `Video` record (and decrements credits), while the frontend listens via SSE (`/api/videos/stream`) to update the dashboard and media library.

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MongoDB instance
- Redis instance (for Bull queue)
- Cloudinary account (video uploads)
- Google API key with access to Veo (via `google-generativeai`)
- SMTP credentials (for password reset emails)

## Environment Variables

### Backend (`Backend/.env`)
- `MONGO_URI` – Mongo connection string.
- `JWT_SECRET` – Secret for access tokens.
- `JWT_EXPIRES_IN` – Optional access token TTL (e.g., `7d`).
- `REFRESH_TOKEN_EXPIRES_IN` – Refresh token TTL (default `30d`).
- `REDIS_URL` – Redis URL for Bull (default `redis://127.0.0.1:6379`).
- `AI_SERVICE_URL` – Base URL of the FastAPI AI service (e.g., `http://localhost:8000`).
- `VIDEO_WORKER_CONCURRENCY` – Optional Bull worker concurrency.
- `VIDEO_SSE_POLL_MS` – Optional SSE poll interval (ms).
- `GOOGLE_CLIENT_ID` – Google OAuth client id.
- `FRONTEND_URL` – Used to build password reset links.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` – Email transport settings.

### AI Service (`AI_Service/.env`)
- `GOOGLE_API_KEY` – API key for `google-generativeai`.
- `VEO_MODEL` – Optional Veo model (default `veo-3.1-generate-preview`).
- `VEO_ASPECT_RATIO`, `VEO_RESOLUTION`, `VEO_DURATION_SECONDS` – Optional generation overrides.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` – For video uploads.
- `WEBHOOK_URL` – Backend webhook URL (default `http://localhost:5001/api/videos/webhook`).
- `MONGODB_URI` – Optional Mongo URI for job status logging.
- `MONGO_DB`, `MONGO_JOBS_COLLECTION` – Optional logging db/collection names.

### Frontend (`Frontend/.env`)
- `VITE_API_BASE_URL` – Points to the backend (e.g., `http://localhost:5001`).

## Running Locally

### Backend API
```bash
cd Backend
npm install
npm run dev            # starts Express API on PORT (default 5001)
npm run worker         # in a separate shell, starts the Bull worker
```
Ensure Redis and Mongo are running, and `AI_SERVICE_URL` points to your FastAPI service.

### AI Service
```bash
cd AI_Service
python -m venv .venv
source .venv/bin/activate     # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Requires valid Google + Cloudinary credentials; the service will call the backend webhook when done.

### Frontend
```bash
cd Frontend
npm install
npm run dev           # Vite dev server (default http://localhost:5173)
```
Set `VITE_API_BASE_URL` to the backend URL so auth and video routes resolve correctly.

## Key Endpoints
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET/PUT /api/auth/me`, `POST /api/auth/forgot`, `POST /api/auth/reset`
- Video jobs: `POST /api/videos/generate` (JWT), `GET /api/videos` (list current user), `GET /api/videos/stream` (SSE), `POST /api/videos/webhook` (AI service callback), `POST /api/videos/:id` (fetch job by id)
- AI service: `POST /generate_video_veo` (internal; called by worker)

## Frontend Features
- Auth flows with JWT + refresh and Google sign-in.
- Dashboard showing credit balance and recent video statuses.
- Prompt-based video generator with toast feedback.
- Media library with live updates over SSE and inline video playback.
- Profile settings and placeholders for additional workflows.

## Notes
- Credits are stored on the user record (default 2) and decremented after webhook completion.
- The queue worker must be running for generation requests to reach the AI service.
- Password reset emails require SMTP variables to be set; otherwise that flow will fail.
