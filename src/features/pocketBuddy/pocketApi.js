import axios from "axios";

const WEBHOOK_ENDPOINT = "http://localhost:5000/api/v1/pocket/webhook";

/**
 * Simulate a debit transaction against the PocketBuddy webhook.
 *
 * @param {string} userId - The current user's identifier.
 * @param {number} amount - The transaction amount to debit.
 * @returns {Promise<object|null>} The API response data, or null on failure.
 */
export async function simulateTransaction(userId, amount) {
  try {
    const payload = {
      userId,
      vendor: "Campus Cafe",
      amount,
      transactionType: "debit",
    };

    const response = await axios.post(WEBHOOK_ENDPOINT, payload);
    return response.data;
  } catch (error) {
    console.error("simulateTransaction failed:", error);
    return null;
  }
}

export default simulateTransaction;