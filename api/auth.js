// api/auth.js
import api, { saveTokens, clearTokens, getTokens } from "./client";
import endpoints from "./endpoints";
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
    const response = await api.post(endpoints.logout, { refresh_token: refreshToken });
    
    // Clear tokens regardless of the response
    await clearTokens();
    
    // Also clear user data from AsyncStorage
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("authToken");
    
    console.log("Logout successful");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    
    // Still clear tokens even if the API call fails
    await clearTokens();
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("authToken");
    
    // Return success even if API call fails, as we've cleared local tokens
    return { success: true, error: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const res = await api.post(endpoints.login, { email, password });
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
