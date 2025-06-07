import api from "../client";
import endpoints from "../endpoints";


export const likeUser = async (userId, like) => {
    try {
      const res = await api.post(endpoints.users.like, {
        target_user_id: userId,
        like: like,
      });
      console.log("❤️ Liked user:", res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to like user:", message);
      throw new Error(message);
    }
  };