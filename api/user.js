// api/user.js
import api from "./client";
import endpoints from "./endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Get user data from AsyncStorage
export const getUserDataFromStorage = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data from AsyncStorage:", error);
    return null;
  }
};

// Update user profile on the server
export const updateUserProfile = async (userData) => {
  try {
    // Get the auth token
    const token = await AsyncStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    // Check if we have a photo to upload
    const hasPhoto = userData.photo && (userData.photo.uri || userData.photo.startsWith('data:'));
    
    let response;
    
    if (hasPhoto) {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add the photo to FormData
      if (userData.photo.uri) {
        // If it's an image picked from the device
        const photoUri = userData.photo.uri;
        const filename = photoUri.split('/').pop();
        const match = /\.([\w\d_]+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('photo', {
          uri: photoUri,
          name: filename,
          type
        });
      } else if (userData.photo.startsWith('data:')) {
        // If it's a base64 string, we'll need to convert it

        // Implementation would depend on backend requirements
      }
      
      // Add other user data fields to FormData
      Object.keys(userData).forEach(key => {
        if (key !== 'photo') {
          formData.append(key, userData[key]);
        }
      });
      
      // Set up headers with the auth token and content type for FormData
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      

      
      // Make the API call with FormData
      response = await api.put(endpoints.updateUserProfile, formData, { headers });
    } else {
      // Regular JSON request without photo
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Make the API call to update user profile
      response = await api.put(endpoints.updateUserProfile, userData, { headers });
    }
    
    // Check if the response contains user data before saving
    if (response.data && response.data.user) {
      // Save the updated user data to AsyncStorage
      await saveUserDataToStorage(response.data.user);
    } else {

    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
