import axios from "axios";

const PRESENCE_ENDPOINT = "http://localhost:5000/api/v1/presence/ping";

export async function pingPresence(lat, lng, userId = "student_1") {
  try {
    await axios.post(PRESENCE_ENDPOINT, { userId, lat, lng });
    console.log(`📍 Background GPS Ping Sent: [${lat}, ${lng}]`);
  } catch (error) {
    console.error("Presence ping failed. Backend might be offline:", error);
  }
}