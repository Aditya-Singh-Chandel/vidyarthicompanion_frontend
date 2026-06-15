import apiClient from "@/lib/apiClient";

/**
 * Read a File object and resolve with its Data URL (Base64-encoded string).
 * We keep the prefix to strictly match the backend API contract.
 *
 * @param {File} file - The file to encode.
 * @returns {Promise<string>} Resolves with the Base64 Data URL.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Return the full result including the data:<mime>;base64, prefix
      resolve(typeof reader.result === "string" ? reader.result : "");
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Upload a schedule image for academic-override verification.
 * userId is derived server-side from the JWT.
 *
 * @param {File} file - Raw File object from a file input.
 * @param {string|null} [nodeId] - Optional community node to share the events with.
 * @returns {Promise<Array|null>} The API response data array, or null on failure.
 */
export async function verifyScheduleOverride(file, nodeId = null) {
  try {
    const imageString = await fileToBase64(file);

    const payload = {
      eventType: "academic",
      imageString,
      nodeId: nodeId || null,
    };

    const response = await apiClient.post("/overrides/verify", payload);

    // Backend returns the array inside response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error("verifyScheduleOverride failed:", error);
    return null;
  }
}

export default verifyScheduleOverride;



/**
 * Manually add an event with explicit text + chosen date/time.
 * userId is derived server-side from the JWT.
 *
 * @param {object} params - { eventName, date (YYYY-MM-DD), time (HH:MM), location, nodeId }
 * @returns {Promise<object|null>} { status, message, data } or null on failure.
 */
export async function createManualEvent({ eventName, date, time, location, nodeId, category }) {
  try {
    const response = await apiClient.post("/overrides/manual", {
      eventName,
      date: date || null,
      time: time || null,
      location,
      nodeId: nodeId || null,
      category: category === "deadline" ? "deadline" : "alert",
    });
    return response.data;
  } catch (error) {
    console.error("createManualEvent failed:", error);
    return null;
  }
}
