import apiClient from "@/lib/apiClient";

/**
 * Fetch the live wallet summary: balance, budget, meal threshold, affordable
 * options, and recent transactions. userId derived server-side from the JWT.
 *
 * @returns {Promise<object|null>}
 */
export async function getWalletSummary() {
  try {
    const response = await apiClient.get("/pocket/summary");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getWalletSummary failed:", error);
    return null;
  }
}

/**
 * Fetch hyper-local affordable meal options for the remaining budget.
 * @returns {Promise<object|null>}
 */
export async function getMealPlan() {
  try {
    const response = await apiClient.get("/pocket/meals");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getMealPlan failed:", error);
    return null;
  }
}

/**
 * Simulate a debit transaction against the PocketBuddy webhook (Amazon Pay sandbox).
 * userId is derived server-side from the JWT.
 *
 * @param {number} amount - The transaction amount to debit (INR).
 * @param {object} [opts] - Optional { vendor, category, transactionType }.
 * @returns {Promise<object|null>} The API response data, or null on failure.
 */
export async function simulateTransaction(amount, opts = {}) {
  try {
    const payload = {
      vendor: opts.vendor || "Campus Cafe",
      amount,
      transactionType: opts.transactionType || "debit",
      category: opts.category || "food",
    };

    const response = await apiClient.post("/pocket/webhook", payload);
    return response.data;
  } catch (error) {
    console.error("simulateTransaction failed:", error);
    return null;
  }
}

export default simulateTransaction;
