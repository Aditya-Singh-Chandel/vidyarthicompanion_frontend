import apiClient from "@/lib/apiClient";

/** Read a File as a base64 data URL (for Gemini document parsing). */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Full profile: financial config, communities, schedule, mess menu. */
export async function getProfile() {
  try {
    const response = await apiClient.get("/profile");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getProfile failed:", error);
    return null;
  }
}

/** Update budget / safe-buffer / primary communities. */
export async function updateFinancial(payload) {
  try {
    const response = await apiClient.put("/profile/financial", payload);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("updateFinancial failed:", error);
    return null;
  }
}

/**
 * Parse an uploaded document via Gemini (no DB write).
 * @param {'timetable'|'menu'} type
 * @param {string} image - base64 data URL
 */
export async function parseDocument(type, image) {
  try {
    const response = await apiClient.post("/profile/parse-document", { type, image });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("parseDocument failed:", error);
    return { available: false, message: "Parsing failed. Try again or enter manually." };
  }
}

/** Persist the confirmed class schedule. */
export async function saveSchedule(slots) {
  try {
    const response = await apiClient.post("/profile/schedule", { slots });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("saveSchedule failed:", error);
    return null;
  }
}

/** Persist the confirmed mess menu for a community (shared with all members). */
export async function saveMenu(nodeId, menu) {
  try {
    const response = await apiClient.post("/profile/menu", { nodeId, menu });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("saveMenu failed:", error);
    return null;
  }
}
