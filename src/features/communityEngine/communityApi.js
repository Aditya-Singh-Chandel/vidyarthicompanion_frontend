import axios from "axios";

const VOTE_ENDPOINT = "http://localhost:5000/api/v1/community/vote";

export async function submitConsensusVote(eventId, voteType, userId) {
  try {
    const payload = {
      eventId,
      voteType, // 1 for Echo, -1 for Flag
      userId
    };
    
    const response = await axios.post(VOTE_ENDPOINT, payload);
    return response.data;
  } catch (error) {
    console.error("submitConsensusVote failed:", error);
    return null;
  }
}