import api from "../client";
import endpoints from "../endpoints";

// creating a new aprtment for a user.
export const createApartment = async (formData) => {
    try {
      const res = await api.post(endpoints.apartments.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to create apartment:", message);
      throw new Error(message);
    }
  };
  