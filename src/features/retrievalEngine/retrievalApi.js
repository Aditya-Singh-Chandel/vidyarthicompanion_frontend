import apiClient from "@/lib/apiClient";

export async function askCampusFlow(query) {
  try {
    // userId is derived server-side from the JWT.
    const response = await apiClient.post("/retrieval/ask", { query });
    return response.data.data.answer;
  } catch (error) {
    console.error("Retrieval failed:", error);
    return "CampusFlow is currently offline. Please try again later.";
  }
}
