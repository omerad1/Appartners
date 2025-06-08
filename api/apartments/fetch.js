import api from "../client";
import endpoints from "../endpoints";

export const getUserApartments = async () => {
  try {
    const res = await api.get(endpoints.apartments.getMy);
    console.log("🏠 Fetched user's apartments:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch apartments:", message);
    throw new Error(message);
  }
};

export const getApartments = async (filters = {}) => {
    try {
      // Check if we have any filters to apply
      const hasFilters = Object.keys(filters).length > 0;
  
      // If we have filters, add them as query parameters
      const res = hasFilters
        ? await api.get(endpoints.apartments.getSwipes, { params: filters })
        : await api.get(endpoints.apartments.getSwipes);
  
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch apartments:", message);
      throw new Error(message);
    }
  };
  