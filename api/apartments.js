import api from "./client";
import endpoints from "./endpoints";

export const getApartments = async () => {
  try {
    const res = await api.get(endpoints.GET_APARTMENTS);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch apartments:", message);
    throw new Error(message);
  }
};
