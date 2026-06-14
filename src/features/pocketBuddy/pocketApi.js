import apiClient from "@/lib/apiClient";

/**
 * Simulate a debit transaction against the PocketBuddy webhook.
 * userId is derived server-side from the JWT.
 *
 * @param {number} amount - The transaction amount to debit.
 * @returns {Promise<object|null>} The API response data, or null on failure.
 */
export async function simulateTransaction(amount) {
  try {
    const payload = {
      vendor: "Campus Cafe",
      amount,
      transactionType: "debit",
    };

    const response = await apiClient.post("/pocket/webhook", payload);
    return response.data;
  } catch (error) {
    console.error("simulateTransaction failed:", error);
    return null;
  }
}

export default simulateTransaction;
