import api from "./client";
import endpoints from "./endpoints";
import { getUserDataFromStorage } from "./user";

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
    const response = await api.get(`${endpoints.users}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Get details of multiple users
 * @param {Array<string|number>} userIds - Array of user IDs to fetch
 * @returns {Promise<Array<Object>>} Array of user data
 */
export const getMultipleUsers = async (userIds) => {
  try {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return [];
    }

    // Make API call to get multiple users (endpoint may vary based on API design)
    const response = await api.post(`${endpoints.users}/batch`, {
      ids: userIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching multiple users:", error);
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
    const response = await api.get(endpoints.profile);
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
