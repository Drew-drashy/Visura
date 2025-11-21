// url.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// video routes
export const VIDEO_GENERATE_URL = `${BASE_URL}/api/videos/generate`;
export const VIDEO_BY_ID_URL = (videoJobId: string) => `${BASE_URL}/api/videos/${videoJobId}`;
export const VIDEO_LIST_URL = `${BASE_URL}/api/videos`;
export const VIDEO_STREAM_URL = `${BASE_URL}/api/videos/stream`;

// auth routes
export const AUTH_RESET_URL = `${BASE_URL}/api/auth/reset`;
export const AUTH_FORGOT_URL = `${BASE_URL}/api/auth/forgot`;
export const AUTH_ME_URL = `${BASE_URL}/api/auth/me`;
export const AUTH_LOGOUT_URL = `${BASE_URL}/api/auth/logout`;
export const AUTH_REFRESH_URL = `${BASE_URL}/api/auth/refresh`;
export const AUTH_LOGIN_URL = `${BASE_URL}/api/auth/login`;
export const AUTH_REGISTER_URL = `${BASE_URL}/api/auth/register`;
export const AUTH_UPDATE_URL = `${BASE_URL}/api/auth/me`;
