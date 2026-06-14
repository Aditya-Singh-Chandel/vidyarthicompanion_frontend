import apiClient from "@/lib/apiClient";

/**
 * Evaluate whether the student qualifies for a Safe-Skip right now.
 * userId is derived server-side from the JWT.
 *
 * @returns {Promise<object|null>} Evaluation data { burnoutScore, recommendSkip, reason } or null on failure.
 */
export async function evaluateSafeSkip() {
  try {
    const response = await apiClient.get("/empathy/evaluate");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("evaluateSafeSkip failed:", error);
    return null;
  }
}

/**
 * Record a lifestyle metric in the Empathy Mesh.
 *
 * @param {object} params
 * @param {string} params.logType - e.g. "sleep", "stress_level", "meal_skipped", "social_isolation".
 * @param {number} params.severity - 1-10 severity score.
 * @param {string} [params.notes]
 * @returns {Promise<object|null>} The created log or null on failure.
 */
export async function logLifestyleMetric({ logType, severity, notes }) {
  try {
    const response = await apiClient.post("/empathy/log", { logType, severity, notes });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("logLifestyleMetric failed:", error);
    return null;
  }
}

export default evaluateSafeSkip;
