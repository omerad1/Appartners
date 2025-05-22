import endpoints from "./endpoints";
import api from "./client"


export const getUserChatRooms = async () => {
    try {
      const res = await api.get(endpoints.chatRooms);
      console.log("🏠 Fetched chat rooms", JSON.stringify(res.data, null, 2));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch chat rooms", message);
      throw new Error(message);
    }
};

export const createChatRoomById = async (participant_id) => {
    try {
      const res = await api.post(endpoints.chatRooms, { participant_id });
      console.log("🏠 Created chat room", res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to create chat room", message);
      throw new Error(message);
    }
};