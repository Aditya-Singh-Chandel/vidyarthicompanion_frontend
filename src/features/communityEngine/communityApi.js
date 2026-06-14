import apiClient from "@/lib/apiClient";

export async function submitConsensusVote(eventId, voteType) {
  try {
    // Voter identity is derived server-side from the JWT.
    const response = await apiClient.post("/community/vote", {
      eventId,
      voteType, // 1 for Echo, -1 for Flag
    });
    return response.data;
  } catch (error) {
    console.error("submitConsensusVote failed:", error);
    return null;
  }
}

/**
 * Fetch the campus schedule feed with consensus state.
 * @param {string} [status] - optional filter: 'pending' | 'verified' | 'rejected'
 * @returns {Promise<Array>} list of events (empty array on failure)
 */
export async function getScheduleEvents(status) {
  try {
    const response = await apiClient.get("/community/events", {
      params: status ? { status } : undefined,
    });
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getScheduleEvents failed:", error);
    return [];
  }
}

/**
 * Cast a trust-weighted consensus vote on an academic event.
 * @param {string} eventId
 * @param {number} voteType - 1 (Echo) or -1 (Flag)
 * @returns {Promise<object|null>} { consensusScore, status, echoes, flags } or null
 */
export async function voteOnEvent(eventId, voteType) {
  try {
    const response = await apiClient.post("/community/events/vote", { eventId, voteType });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("voteOnEvent failed:", error);
    return null;
  }
}
