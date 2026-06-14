import apiClient from "@/lib/apiClient";

/**
 * Fetch the assembled, prioritized daily plan for the current user.
 * userId is derived server-side from the JWT.
 *
 * @returns {Promise<object|null>} { date, summary, cards } or null on failure.
 */
export async function getDailyPlan() {
  try {
    const response = await apiClient.get("/routine/today");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getDailyPlan failed:", error);
    return null;
  }
}

export default getDailyPlan;
