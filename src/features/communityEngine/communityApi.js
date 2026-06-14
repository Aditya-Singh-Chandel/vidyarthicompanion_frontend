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
