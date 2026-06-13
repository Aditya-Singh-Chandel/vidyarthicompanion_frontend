import axios from "axios";

const VERIFY_ENDPOINT = "http://localhost:5000/api/v1/overrides/verify";

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
 *
 * @param {File} file - Raw File object from a file input.
 * @param {string} userId - The current user's identifier.
 * @returns {Promise<Array|null>} The API response data array, or null on failure.
 */
export async function verifyScheduleOverride(file, userId = "student_1") {
  try {
    const imageString = await fileToBase64(file);

    const payload = {
      userId,
      eventType: "academic", // Updated to match User 2's exact backend contract
      imageString,
    };

    const response = await axios.post(VERIFY_ENDPOINT, payload);
    
    // User 3's backend returns the array inside response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error("verifyScheduleOverride failed:", error);
    return null;
  }
}

export default verifyScheduleOverride;