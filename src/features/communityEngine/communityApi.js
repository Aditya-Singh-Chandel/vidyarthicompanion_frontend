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
      // The community's class timetable / mess menu that COULD be adopted into
      // the user's personal profile. Includes a `changed` flag (mismatch); the
      // UI asks the user before applying it via adoptNodeBaseline().
      adoptable: response.data?.adoptable ?? null,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("joinByCode failed:", error);
    return { status: "error", message: error?.response?.data?.message || "Invalid invite code." };
  }
}

/**
 * A community's current official timetable (Academic) or menu (Mess).
 * @returns {Promise<{kind:string, nodeName:string, schedule:Array, menu:object}|null>}
 */
export async function getNodeBaseline(nodeId) {
  try {
    const response = await apiClient.get(`/community/nodes/${nodeId}/baseline`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getNodeBaseline failed:", error);
    return null;
  }
}

/**
 * Adopt a community's timetable/menu into the user's personal profile,
 * replacing the previous version. @returns {Promise<object|null>} adopted descriptor
 */
export async function adoptNodeBaseline(nodeId) {
  try {
    const response = await apiClient.post(`/community/nodes/${nodeId}/adopt-baseline`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("adoptNodeBaseline failed:", error);
    return null;
  }
}

/** Today's per-meal mess votes (tallies + my votes + current time-gated slot). */
export async function getMessVotes(nodeId) {
  try {
    const response = await apiClient.get(`/community/nodes/${nodeId}/mess-vote`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getMessVotes failed:", error);
    return null;
  }
}

/** Cast a vote on the current mess meal: verdict 'eatable' | 'leave'. */
export async function castMessVote(nodeId, verdict, slot) {
  try {
    const response = await apiClient.post(`/community/nodes/${nodeId}/mess-vote`, { verdict, slot });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("castMessVote failed:", error);
    return null;
  }
}

/**
 * Admin-only: update a community's baseline timetable (Academic) or menu (Mess).
 * @param {string} nodeId
 * @param {{schedule?:Array, menu?:object}} payload
 */
export async function updateBaseline(nodeId, payload) {
  try {
    const response = await apiClient.put(`/community/nodes/${nodeId}/baseline`, payload);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("updateBaseline failed:", error);
    return null;
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
