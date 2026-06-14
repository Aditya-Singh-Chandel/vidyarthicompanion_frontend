import apiClient from "@/lib/apiClient";

export async function pingPresence(lat, lng) {
  try {
    // userId is derived server-side from the JWT.
    await apiClient.post("/presence/ping", { lat, lng });
    console.log(`Background GPS Ping Sent: [${lat}, ${lng}]`);
  } catch (error) {
    console.error("Presence ping failed. Backend might be offline:", error);
  }
}
