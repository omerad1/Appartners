import api from "./client";
import endpoints from "./endpoints";

/**
 * Fetches the preferences payload containing cities and tags data
 * This data is the same for all users and can be used globally in the app
 */
export const getPreferencesPayload = async () => {
  try {
    const res = await api.get(endpoints.preferencesPayload);
    //console.log("Fetched preferences payload", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch preferences payload", message);
    throw new Error(message);
  }
};


export const getQuestions = async () => {
  try {
    const res = await api.get(endpoints.questions);
    console.log("fetched questions", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch preferences payload", message);
    throw new Error(message);
  }
}

