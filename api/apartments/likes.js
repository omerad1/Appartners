import api from "../client"
import endpoints from "../endpoints";
import {transformApartmentData, transformUserData} from "../utils"
// Fetch apartments that the user has liked
export const getLikedApartments = async () => {
    try {
      const res = await api.get(endpoints.apartments.getMyLikes);
      console.log("🏠 Liked apartments:", res.data);
      // Transform the data to match the expected format
      let transformedData;
  
      if (Array.isArray(res.data)) {
        transformedData = res.data.map((apartment) =>
          transformApartmentData(apartment)
        );
      } else if (res.data && Array.isArray(res.data.results)) {
        transformedData = res.data.results.map((apartment) =>
          transformApartmentData(apartment)
        );
      } else {
        console.warn("Unexpected data format for liked apartments:", res.data);
        transformedData = [];
      }
  
      console.log("Transformed apartment data:", transformedData);
      return transformedData;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch liked apartments:", message);
      throw new Error(message);
    }
  };
  
  // Fetch users who liked the user's apartment
  export const getUsersWhoLikedMyApartment = async () => {
    try {
      const res = await api.get(endpoints.apartments.getLikedMy);
  
      // Transform the data to match the expected format
      let transformedData;
  
      if (Array.isArray(res.data)) {
        transformedData = res.data.map((user) => transformUserData(user));
      } else if (res.data && Array.isArray(res.data.results)) {
        transformedData = res.data.results.map((user) => transformUserData(user));
      } else {
        console.warn(
          "Unexpected data format for users who liked my apartment:",
          res.data
        );
        transformedData = [];
      }
  
      console.log("Transformed user data:", transformedData);
      return transformedData;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch users who liked my apartment:", message);
      throw new Error(message);
    }
  };
  
  // Like an apartment
  export const likeApartment = async (apartmentId) => {
    try {
      const res = await api.post(endpoints.apartments.preference, {
        apartment_id: apartmentId,
        like: true,
      });
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
      const res = await api.post(endpoints.apartments.preference, {
        apartment_id: apartmentId,
        like: false,
      });
      console.log("💔 Unliked apartment:", res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to unlike apartment:", message);
      throw new Error(message);
    }
  };