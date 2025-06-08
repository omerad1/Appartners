import api from "../client";
import endpoints from "../endpoints";

export const getQuestions = async () => {
    try {
      const res = await api.get(endpoints.questions.getQuestions);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch preferences payload", message);
      throw new Error(message);
    }
  }


  /**
 * Fetches the user's questionnaire responses from the server
 * @returns {Promise<Array>} Array of user's responses
 */
export const getUserAnswers = async () => {
    try {
      const res = await api.get(endpoints.questions.answers);
      console.log("Fetched user's responses:", JSON.stringify(res.data, null, 2));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch responses:", message);
      throw new Error(message);
    }
  };