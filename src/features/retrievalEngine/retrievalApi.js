import axios from "axios";

const RETRIEVAL_ENDPOINT = "http://localhost:5000/api/v1/retrieval/ask";

export async function askCampusFlow(query, userId = "student_123") {
  try {
    const response = await axios.post(RETRIEVAL_ENDPOINT, { query, userId });
    return response.data.data.answer;
  } catch (error) {
    console.error("Retrieval failed:", error);
    return "CampusFlow is currently offline. Please try again later.";
  }
}