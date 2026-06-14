import apiClient from "@/lib/apiClient";

/**
 * Fetch the automated Wellness Tracker snapshot (tiredness, isolation, and
 * overall burnout scores plus their supporting series). userId is derived
 * server-side from the JWT.
 *
 * @returns {Promise<object|null>} The summary payload or null on failure.
 */
export async function getWellnessSummary() {
  try {
    const response = await apiClient.get("/wellness/summary");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getWellnessSummary failed:", error);
    return null;
  }
}

/**
 * Record the student's nightly sleep-cycle dropdown selection.
 *
 * @param {string} bucket - One of "4-6 hrs", "6-8 hrs", "8-10 hrs", "10-12 hrs".
 * @returns {Promise<object|null>} The created log or null on failure.
 */
export async function logSleepCycle(bucket) {
  try {
    const response = await apiClient.post("/wellness/sleep", { bucket });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("logSleepCycle failed:", error);
    return null;
  }
}

export default getWellnessSummary;
