import api from "../client";
import endpoints from "../endpoints";

// creating a new aprtment for a user.
export const createApartment = async (formData) => {
  try {
    // NOTE: we must set multipart/form-data on RN to get a real multipart body
    const res = await api.post(endpoints.apartments.create, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      // ensure Axios does not try to JSON-stringify
      transformRequest: (data) => data,
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ CreateApartment validation error:",
      err.response?.status,
      err.response?.data
    );
    throw err;
  }
};
