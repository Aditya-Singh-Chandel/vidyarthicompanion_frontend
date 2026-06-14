import apiClient from "@/lib/apiClient";

export async function getDepartureTime(eventId, currentLocation) {
  try {
    const response = await apiClient.post("/transit/calculate", { eventId, currentLocation });
    return response.data;
  } catch (error) {
    console.error("getDepartureTime failed:", error);
    return null;
  }
}
