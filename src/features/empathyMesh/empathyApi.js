import axios from "axios";

const BASE_ENDPOINT = "http://localhost:5000/api/v1/empathy";

/**
 * Evaluate whether the student qualifies for a Safe-Skip right now.
 *
 * @param {string} userId - The current user's identifier.
 * @returns {Promise<object|null>} Evaluation data { burnoutScore, recommendSkip, reason } or null on failure.
 */
export async function evaluateSafeSkip(userId = "student_1") {
  try {
    const response = await axios.get(`${BASE_ENDPOINT}/evaluate/${userId}`);
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
 * @param {string} params.userId
 * @param {string} params.logType - e.g. "sleep", "stress_level", "meal_skipped", "social_isolation".
 * @param {number} params.severity - 1-10 severity score.
 * @param {string} [params.notes]
 * @returns {Promise<object|null>} The created log or null on failure.
 */
export async function logLifestyleMetric({ userId = "student_1", logType, severity, notes }) {
  try {
    const response = await axios.post(`${BASE_ENDPOINT}/log`, {
      userId,
      logType,
      severity,
      notes,
    });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("logLifestyleMetric failed:", error);
    return null;
  }
}

export default evaluateSafeSkip;
