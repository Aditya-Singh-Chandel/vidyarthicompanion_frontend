import apiClient from "@/lib/apiClient";

/**
 * Fetch cross-functional synergies (meal splits, carpools) scanned from the
 * user's community graph + live balances. userId derived from the JWT.
 *
 * @returns {Promise<Array>} list of synergy cards (empty array on failure).
 */
export async function getSynergies() {
  try {
    const response = await apiClient.get("/recommendations/synergies");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getSynergies failed:", error);
    return [];
  }
}

export default getSynergies;
