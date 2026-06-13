import axios from "axios";

const TRANSIT_ENDPOINT = "http://localhost:5000/api/v1/transit/calculate";

export async function getDepartureTime(eventId, currentLocation) {
  try {
    const response = await axios.post(TRANSIT_ENDPOINT, { eventId, currentLocation });
    return response.data;
  } catch (error) {
    console.error("getDepartureTime failed:", error);
    return null;
  }
}