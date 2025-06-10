import endpoints from "./endpoints";
import api from "./client"


export const getUserChatRooms = async () => {
    try {
      const res = await api.get(endpoints.chatRooms);
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
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to create chat room", message);
      throw new Error(message);
    }
};

// Get messages for a specific room
export const getRoomMessages = async (roomId) => {
  try {
    const res = await api.get(`${endpoints.chatRooms}${roomId}/messages/`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch messages", message);
    throw new Error(message);
  }
};

// Send a message via REST API (fallback if WebSocket fails)
export const sendMessage = async ( recipient_id, content) => {
  try {
    const res = await api.post(`${endpoints.chatRooms}send_message_to_user/`, { recipient_id, content});
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to send message", message);
    throw new Error(message);
  }
};

// Mark messages as read
export const markMessagesAsRead = async (roomId, messageIds) => {
  try {
    const res = await api.post(`${endpoints.chatRooms}${roomId}/read/`, { message_ids: messageIds });
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to mark messages as read", message);
    throw new Error(message);
  }
};

export const deleteChatRoom = async (roomId) => {
  try {
    const res = await api.delete(`${endpoints.chatRooms}${roomId}/`);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to delete chat room", message);
    throw new Error(message);
  }
};