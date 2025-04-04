import api from "./client";
import endpoints from "./endpoints";

// For checking if email and phone are unique
export const validateUnique = async (email, phone) => {
  const res = await api.post(endpoints.validateUnique, { email, phone });
  console.log("Validation successful:", res.data);
  return res.data;
};
