import api from "../client";
import endpoints from "../endpoints";

// creating a new aprtment for a user.
export const createApartment = async (formData) => {
    try {
      console.log("formData", formData);
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
  