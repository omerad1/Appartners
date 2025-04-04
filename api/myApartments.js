import api from "./client";
import endpoints from "./endpoints";

export const getUserApartments = async () => {
  try {
    const res = await api.get(endpoints.myApartments);
    console.log("🏠 Fetched user's apartments:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch apartments:", message);
    throw new Error(message);
  }
};
