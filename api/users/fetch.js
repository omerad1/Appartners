import AsyncStorage from "@react-native-async-storage/async-storage";
import endpoints from "../endpoints";
import api from "../client";


// Get my user data from AsyncStorage
export const getUserDataFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data from AsyncStorage:", error);
      return null;
    }  
};

// Fetch my user data - first try AsyncStorage, then server if needed
export const fetchUserData = async (forceRefresh = false) => {
  try {
    // First try to get from AsyncStorage (unless forceRefresh is true)
    if (!forceRefresh) {
      const localUserData = await getUserDataFromStorage();

      if (localUserData) {
        console.log("User data found in AsyncStorage");
        return localUserData;
      }

      console.log("No user data in AsyncStorage, fetching from server...");
    } else {
      console.log("Force refresh requested, fetching user data from server...");
    }

    // Make the API call to get user profile
    const response = await api.get(endpoints.users.getMe);

    // Log the complete user data from the response
    console.log(
      "User data from /users/me endpoint:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if the response contains user data before saving
    if (response.data) {
      // Save the user data to AsyncStorage
      await saveUserDataToStorage(response.data);
      return response.data;
    } else {
      console.warn("No user data found in response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
/**
 * Get the current logged-in user's details
 * @param {boolean} forceRefresh - Whether to force refresh from server
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async (forceRefresh = false) => {
    try {
      // Try to get from local storage first
      if (!forceRefresh) {
        const localData = await getUserDataFromStorage();
        if (localData) return localData;
      }
  
      // If not found locally or forceRefresh is true, fetch from server
      const response = await api.get(endpoints.users.getMe);
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  /**
 * Get details of a specific user by ID
 * @param {string|number} userId - The ID of the user to fetch
 * @returns {Promise<Object>} User data
 */
export const getUser = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
  
      // Make API call to get user details
      const response = await api.get(endpoints.users.fetch(userId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  };

// for now it will be here
  // Save user data to AsyncStorage
export const saveUserDataToStorage = async (userData) => {
    try {
      // Check if userData is valid before saving
      if (!userData) {
        return false;
      }
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
  
      return true;
    } catch (error) {
      console.error("Error saving user data to AsyncStorage:", error);
      return false;
    }
};

  
// /**
//  * Get details of multiple users
//  * @param {Array<string|number>} userIds - Array of user IDs to fetch
//  * @returns {Promise<Array<Object>>} Array of user data
//  */
// export const getMultipleUsers = async (userIds) => {
//   try {
//     if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
//       return [];
//     }

//     // Make API call to get multiple users (endpoint may vary based on API design)
//     const response = await api.post(`${endpoints.users}/batch`, {
//       ids: userIds,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching multiple users:", error);
//     throw error;
//   }
// };


