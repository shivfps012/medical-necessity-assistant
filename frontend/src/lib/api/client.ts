import axios from "axios";

const apiClient = axios.create({
  // All requests go through Next.js rewrite → backend proxy
  // This keeps the FastAPI URL server-side only, never exposed to browser
  baseURL: "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000, // LLM calls can be slow — 60s before timeout
});

// Response interceptor: normalize error shapes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail =
      error?.response?.data?.detail ||
      error?.message ||
      "An unexpected error occurred";

    // Re-throw with a clean .message for the UI to display
    return Promise.reject(new Error(detail));
  }
);

export default apiClient;