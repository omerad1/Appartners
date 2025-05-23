import api from "./client";
import endpoints from "./endpoints";

export const createApartment = async (formData) => {
  try {
    const res = await api.post(endpoints.newApartment, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("🏠 Apartment created successfully:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to create apartment:", message);
    throw new Error(message);
  }
};
