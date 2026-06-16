import apiClient, { setToken, clearToken } from "@/lib/apiClient";

/**
 * Register a new account. On success the JWT is stored and the user returned.
 * Everyone signs up as a student.
 * @returns {Promise<{user: object}>}
 * @throws {Error} with a user-friendly message on failure.
 */
export async function register({ name, username, email, password }) {
  try {
    const res = await apiClient.post("/auth/register", { name, username, email, password });
    const { token, user } = res.data.data;
    setToken(token);
    return { user };
  } catch (error) {
    if (!error.response) {
      throw new Error(`Network Error: Ensure backend is running. Details: ${error.message}`);
    }
    throw new Error(error.response?.data?.message || "Registration failed. Please try again.");
  }
}

/**
 * Log in with email + password. Stores the JWT on success.
 * @returns {Promise<{user: object}>}
 */
export async function login({ email, password }) {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    const { token, user } = res.data.data;
    setToken(token);
    return { user };
  } catch (error) {
    if (!error.response) {
      throw new Error(`Network Error: Ensure backend is running. Details: ${error.message}`);
    }
    throw new Error(error.response?.data?.message || "Invalid email or password.");
  }
}

/**
 * Fetch the currently authenticated user's profile. Returns null if not logged in.
 */
export async function fetchMe() {
  try {
    const res = await apiClient.get("/auth/me");
    return res.data.data.user;
  } catch {
    return null;
  }
}

export function logout() {
  clearToken();
}
