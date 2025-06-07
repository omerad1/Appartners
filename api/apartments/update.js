import endpoints from "../endpoints";
import api from "../client";

export const updateApartment = async (apartmentId, formData) => {
  try {
    const res = await api.put(endpoints.aparments.update(apartmentId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("🏠 Apartment updated successfully:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to update apartment:", message);
    throw new Error(message);
  }
};
