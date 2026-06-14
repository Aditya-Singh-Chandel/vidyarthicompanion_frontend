import axios from "axios";

/**
 * Single source of truth for the API base URL.
 * Configure via NEXT_PUBLIC_API_BASE_URL in .env.local; falls back to local dev.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "campusflow_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  setToken(null);
}

/**
 * Shared axios instance. Every feature module should import this rather than
 * hardcoding the host, so deploy targets only change one env var.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT to every outgoing request when present.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, drop the stale token and bounce to login (client-side only).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
