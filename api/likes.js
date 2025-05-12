import api from './client';
import endpoints from './endpoints';

// Fetch apartments that the user has liked
export const getLikedApartments = async () => {
  try {
    const res = await api.get('/api/v1/apartments/liked/');
    console.log("🏠 Fetched liked apartments:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch liked apartments:", message);
    throw new Error(message);
  }
};

// Fetch users who liked the user's apartment
export const getUsersWhoLikedMyApartment = async () => {
  try {
    const res = await api.get('/api/v1/apartments/liked-by-users/');
    console.log("👥 Fetched users who liked my apartment:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch users who liked my apartment:", message);
    throw new Error(message);
  }
};

// Like an apartment
export const likeApartment = async (apartmentId) => {
  try {
    const res = await api.post(`/api/v1/apartments/${apartmentId}/like/`);
    console.log("❤️ Liked apartment:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to like apartment:", message);
    throw new Error(message);
  }
};

// Unlike an apartment
export const unlikeApartment = async (apartmentId) => {
  try {
    const res = await api.delete(`/api/v1/apartments/${apartmentId}/like/`);
    console.log("💔 Unliked apartment:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to unlike apartment:", message);
    throw new Error(message);
  }
};
