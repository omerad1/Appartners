// api/auth.js
import api, { saveTokens, clearTokens, getTokens } from "../client";
import endpoints from "../endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logout = async () => {
  try {
    // Get the refresh token
    const { refreshToken } = await getTokens();
    
    if (!refreshToken) {
      console.warn("No refresh token found for logout");
      // Still clear tokens even if no refresh token is found
      await clearTokens();
      return { success: true };
    }
    
    // Call the logout endpoint with the refresh token
    const response = await api.post(endpoints.auth.logout, { refresh_token: refreshToken });
    
    // Clear tokens regardless of the response
    await clearTokens();
    
    // Also clear user data from AsyncStorage
    await AsyncStorage.removeItem("userData");
    
    console.log("Logout successful");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    
    // Still clear tokens even if the API call fails
    await clearTokens();
    await AsyncStorage.removeItem("userData");
    
    // Return success even if API call fails, as we've cleared local tokens
    return { success: true, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const res = await api.post(endpoints.auth.login, { email, password });
    console.log("Login successful:", res.data);

    // Check if tokens exist in the response (UserAuth for access token, RefreshToken for refresh token)
    if (res.data && res.data.UserAuth && res.data.RefreshToken) {
      console.log('Received both access and refresh tokens');
      // Save both tokens securely
      await saveTokens(res.data.UserAuth, res.data.RefreshToken);
      
    } 
    else {
      console.warn("Warning: Authentication tokens not found in response", res.data);
    }
    console.log("this is the data on login: ", res.data)
    return res.data;
  } catch (err) {
    // Log the full error object for debugging
    console.error("Login error - full error:", err);

    // Extract detailed error information
    const errorDetails = {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers,
    };

    console.error(
      "Login error - details:",
      JSON.stringify(errorDetails, null, 2)
    );

    // Create a more informative error message
    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message;

    throw new Error(message);
  }
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
    
    const res = await api.post(endpoints.auth.register, formData, config);
    
    if (res.data && res.data.UserAuth && res.data.RefreshToken) {
      console.log('Received both access and refresh tokens');
      // Save both tokens securely
      await saveTokens(res.data.UserAuth, res.data.RefreshToken);
    }
    return res.data;
  } catch (error) {
    // Extract and log the error response body
    if (error.response) {
      // The server responded with a status code outside the 2xx range
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



export const getNewAcessToken = async () => {
    const {refreshToken} = await getTokens()
    // Call the refresh endpoint directly
    try{
    const res = await api.post(endpoints.auth.refreshToken, {
      refresh_token: refreshToken
    });
    if (res.data && res.data.UserAuth && res.data.RefreshToken)
      // Save the new tokens
      await saveTokens(UserAuth, RefreshToken);
    }
    catch (error){
      consol.log(res.error)
    }
    
};
// For checking if email and phone are unique
export const validateUnique = async (email, phone) => {
  const res = await api.post(endpoints.auth.validateUnique, { email, phone });
  console.log("Validation successful:", res.data);
  return res.data;
};

