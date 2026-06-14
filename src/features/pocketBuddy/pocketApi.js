import apiClient from "@/lib/apiClient";

/**
 * Live wallet summary: balance, monthly budget, runway, spent-this-month,
 * crowdsourced category breakdown, and recent transactions.
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
 * Paginated transaction history.
 * @param {{limit?:number, skip?:number}} [opts]
 * @returns {Promise<Array>}
 */
export async function getTransactions(opts = {}) {
  try {
    const response = await apiClient.get("/pocket/transactions", { params: opts });
    return response.data?.data ?? [];
  } catch (error) {
    console.error("getTransactions failed:", error);
    return [];
  }
}

/**
 * Ingest a transaction. Pass EITHER { raw } (a pasted payment notification/SMS)
 * OR structured fields { merchant, amount, transactionType, category, note }.
 * @returns {Promise<object|null>} response data ({ transaction, summary, alert, needsTag })
 */
export async function ingestTransaction(payload) {
  try {
    const response = await apiClient.post("/pocket/ingest", payload);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("ingestTransaction failed:", error);
    return null;
  }
}

/**
 * Crowdsource a merchant category. Updates the global graph and auto-resolves
 * the same vendor for everyone on campus.
 * @returns {Promise<object|null>}
 */
export async function tagTransaction(transactionId, category, displayName) {
  try {
    const response = await apiClient.post(`/pocket/transactions/${transactionId}/tag`, {
      category,
      displayName,
    });
    return response.data?.data ?? null;
  } catch (error) {
    console.error("tagTransaction failed:", error);
    return null;
  }
}

/**
 * Wallet vs Wellness recommendation (reads the Mess community consensus).
 * @returns {Promise<object|null>}
 */
export async function getRecommendation() {
  try {
    const response = await apiClient.get("/pocket/recommendation");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getRecommendation failed:", error);
    return null;
  }
}

/** Affordable meal options for the remaining budget. @returns {Promise<object|null>} */
export async function getMealPlan() {
  try {
    const response = await apiClient.get("/pocket/meals");
    return response.data?.data ?? null;
  } catch (error) {
    console.error("getMealPlan failed:", error);
    return null;
  }
}
