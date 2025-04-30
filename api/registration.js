import api from "./client";
import endpoints from "./endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For checking if email and phone are unique
export const validateUnique = async (email, phone) => {
  const res = await api.post(endpoints.validateUnique, { email, phone });
  console.log("Validation successful:", res.data);
  return res.data;
};

export const registerUser = async (details) => {
  try {
    // Create FormData object for multipart/form-data request
    const formData = new FormData();
    
    // Add all text fields to FormData
    Object.keys(details).forEach(key => {
      // Skip the photo field, we'll handle it separately
      if (key !== 'photo') {
        formData.append(key, details[key]);
      }
    });
    
    // Add photo to FormData if it exists
    if (details.photo && details.photo.uri) {
      formData.append('photo', {
        uri: details.photo.uri,
        type: details.photo.type || 'image/jpeg',
        name: details.photo.name || `profile-${Date.now()}.jpg`,
      });
      console.log("Adding photo to FormData:", details.photo);
    }
    
    // Configure headers for multipart/form-data
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    console.log("Sending registration with FormData");
    const res = await api.post(endpoints.register, formData, config);
    
    console.log("Registration response:", res.data);
    if (res.status !== 200) {
      return res.data;
    }
    await AsyncStorage.setItem("authToken", res.data.UserAuth);
    return res.data;
  } catch (error) {
    // Extract and log the error response body
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
      console.log("Error response headers:", error.response.headers);
      return { error: true, message: error.response.data, status: error.response.status };
    } else if (error.request) {
      // The request was made but no response was received
      console.log("Error request:", error.request);
      return { error: true, message: "No response received from server", request: error.request };
    } else {
      // Something happened in setting up the request
      console.log("Error message:", error.message);
      return { error: true, message: error.message };
    }
  }
};
