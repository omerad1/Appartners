import api from "./client";
import endpoints from "./endpoints";

export const getApartments = async (filters = {}) => {
  try {
    // Check if we have any filters to apply
    const hasFilters = Object.keys(filters).length > 0;

    // If we have filters, add them as query parameters
    const res = hasFilters
      ? await api.get(endpoints.GET_APARTMENTS, { params: filters })
      : await api.get(endpoints.GET_APARTMENTS);

    console.log("res.data", res.data.apartments[0].user_details);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch apartments:", message);
    throw new Error(message);
  }
};
