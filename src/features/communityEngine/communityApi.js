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



/** Active community alerts (mess, etc.). @returns {Promise<Array>} */
export async function getAlerts() {
  try {
    const response = await apiClient.get("/community/alerts");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getAlerts failed:", error);
    return [];
  }
}

// ---- Multi-Tiered Community Graph (nodes) ----

/** The current user's community nodes. */
export async function getMyNodes() {
  try {
    const response = await apiClient.get("/community/nodes");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getMyNodes failed:", error);
    return [];
  }
}

/** All discoverable nodes (with isMember flag). */
export async function getAllNodes() {
  try {
    const response = await apiClient.get("/community/nodes/all");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getAllNodes failed:", error);
    return [];
  }
}

/** Create a new node. @returns {Promise<object|null>} */
export async function createNode({ name, nodeType, privacy }) {
  try {
    const response = await apiClient.post("/community/nodes", { name, nodeType, privacy });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("createNode failed:", error);
    return null;
  }
}

/** Join a node by id. @returns {Promise<boolean>} */
export async function joinNode(nodeId) {
  try {
    await apiClient.post(`/community/nodes/${nodeId}/join`);
    return true;
  } catch (error) {
    console.error("joinNode failed:", error);
    return false;
  }
}

/** Leave a node by id. @returns {Promise<boolean>} */
export async function leaveNode(nodeId) {
  try {
    await apiClient.post(`/community/nodes/${nodeId}/leave`);
    return true;
  } catch (error) {
    console.error("leaveNode failed:", error);
    return false;
  }
}

/** Members of a node. @returns {Promise<object|null>} */
export async function getNodeMembers(nodeId) {
  try {
    const response = await apiClient.get(`/community/nodes/${nodeId}/members`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getNodeMembers failed:", error);
    return null;
  }
}
