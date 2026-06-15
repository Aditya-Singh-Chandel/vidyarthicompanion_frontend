import apiClient from "@/lib/apiClient";

/**
 * Fetch the campus schedule feed with consensus state.
 * Used by the Master Calendar (verified-only) and other dashboard surfaces.
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
 * Cast a trust-weighted consensus vote on a community update (academic event).
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

// ---- Multi-Tiered Community Graph (nodes) ----

/** The current user's communities. */
export async function getMyNodes() {
  try {
    const response = await apiClient.get("/community/nodes");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getMyNodes failed:", error);
    return [];
  }
}

/** Discoverable PUBLIC communities (private ones never surface here). */
export async function getAllNodes() {
  try {
    const response = await apiClient.get("/community/nodes/all");
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getAllNodes failed:", error);
    return [];
  }
}

/**
 * Create a new community.
 * @param {{name:string, description?:string, nature?:string, visibility?:string, joinPolicy?:string, nodeType?:string}} payload
 * @returns {Promise<object|null>}
 */
export async function createNode(payload) {
  try {
    const response = await apiClient.post("/community/nodes", payload);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("createNode failed:", error);
    return null;
  }
}

/**
 * Attempt to join a community by id. Resolves the outcome so the UI can react:
 *  - 'joined'           : now a member
 *  - 'requested'        : locked community, awaiting admin approval
 *  - 'invite_required'  : private community, needs an invite code
 *  - 'error'            : request failed
 * @returns {Promise<{status:string, message?:string}>}
 */
export async function joinNode(nodeId) {
  try {
    const response = await apiClient.post(`/community/nodes/${nodeId}/join`);
    return { status: response.data?.status || "joined", message: response.data?.message };
  } catch (error) {
    const status = error?.response?.data?.status || "error";
    const message = error?.response?.data?.message;
    console.error("joinNode failed:", error);
    return { status, message };
  }
}

/** Join a PRIVATE community using an invite code. */
export async function joinByCode(code) {
  try {
    const response = await apiClient.post("/community/nodes/join-by-code", { code });
    return {
      status: "joined",
      node: response.data?.data,
      conflict: response.data?.conflict ?? null,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("joinByCode failed:", error);
    return { status: "error", message: error?.response?.data?.message || "Invalid invite code." };
  }
}

/** Leave a community by id. @returns {Promise<boolean>} */
export async function leaveNode(nodeId) {
  try {
    await apiClient.post(`/community/nodes/${nodeId}/leave`);
    return true;
  } catch (error) {
    console.error("leaveNode failed:", error);
    return false;
  }
}

/** Owner-only: approve a pending join request on a locked community. */
export async function approveRequest(nodeId, userId) {
  try {
    await apiClient.post(`/community/nodes/${nodeId}/approve`, { userId });
    return true;
  } catch (error) {
    console.error("approveRequest failed:", error);
    return false;
  }
}

/** Admin-only: promote an existing member to admin. */
export async function promoteMember(nodeId, userId) {
  try {
    await apiClient.post(`/community/nodes/${nodeId}/admins`, { userId });
    return true;
  } catch (error) {
    console.error("promoteMember failed:", error);
    return false;
  }
}

/** Members + pending requests of a community. @returns {Promise<object|null>} */
export async function getNodeMembers(nodeId) {
  try {
    const response = await apiClient.get(`/community/nodes/${nodeId}/members`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getNodeMembers failed:", error);
    return null;
  }
}

/**
 * A community's own column of updates (all statuses) plus its metadata.
 * @returns {Promise<{node:object, updates:Array}|null>}
 */
export async function getNodeFeed(nodeId) {
  try {
    const response = await apiClient.get(`/community/nodes/${nodeId}/feed`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getNodeFeed failed:", error);
    return null;
  }
}
