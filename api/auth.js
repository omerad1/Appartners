// api/auth.js
import api from "./client";
import endpoints from "./endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUserDataToStorage } from "./user";

export const login = async (email, password) => {
  try {
    const res = await api.post(endpoints.login, { email, password });
    console.log("Login successful:", res.data);

    // Check if UserAuth exists before storing it
    if (res.data && res.data.UserAuth) {
      await AsyncStorage.setItem("authToken", res.data.UserAuth);
      
      // Save user data if available
      if (res.data.user) {
        console.log('Saving user data to AsyncStorage:', res.data.user);
        await saveUserDataToStorage(res.data.user);
        
        // Also save raw user data for debugging
        await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
        console.log('User data saved to AsyncStorage');
      }
    } else {
      console.warn("Warning: UserAuth token not found in response", res.data);
    }
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
      headers: err.response?.headers
    };
    
    console.error("Login error - details:", JSON.stringify(errorDetails, null, 2));
    
    // Create a more informative error message
    const message = err.response?.data?.detail || 
                   err.response?.data?.error ||
                   err.response?.data?.message ||
                   err.message;
                   
    throw new Error(message);
  }
};
