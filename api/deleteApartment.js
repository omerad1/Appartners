import api from "./client";

export const deleteApartment = async (apartmentId) => {
  try {
    const res = await api.delete(`/api/v1/apartments/${apartmentId}/`);
    console.log("🗑️ Apartment deleted successfully:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to delete apartment:", message);
    throw new Error(message);
  }
};
