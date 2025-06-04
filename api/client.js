import axios from "axios";
import * as SecureStore from 'expo-secure-store';

// Base URL for the backend
// Change this to match your backend URL and port
const API_BASE_URL = "http://10.0.0.3:8000/";
const API_BASE_URL_Production =
  "https://appartners-backend-production.up.railway.app";

const api_base_tom_comp ="https://583d-2a06-c701-97c3-dc00-dd11-3549-ddf0-e166.ngrok-free.app";

// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Create an axios instance with default config
const api = axios.create({
  baseURL: api_base_tom_comp,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});


// Function to securely save tokens
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    // Save both tokens securely
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

    console.log("Tokens saved securely");
    return true;
  } catch (error) {
    console.error("Error saving tokens:", error);
    return false;
  }
};

// Function to get tokens
export const getTokens = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error getting tokens:", error);
    return { accessToken: null, refreshToken: null };
  }
};

// Function to clear tokens on logout
export const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

    console.log("Tokens cleared");
    return true;
  } catch (error) {
    console.error("Error clearing tokens:", error);
    return false;
  }
};

// Flag to prevent multiple refresh requests
let isRefreshing = false;
// Store pending requests
let failedQueue = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - add access token to requests
api.interceptors.request.use(
  async (config) => {
    // Get access token from secure storage
    const { accessToken } = await getTokens();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 Unauthorized and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token
        const { refreshToken } = await getTokens();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${api.defaults.baseURL}/api/v1/authenticate/refresh/`,
          {
            refresh_token: refreshToken,
          }
        );

        // Extract tokens from response using your API's format
        const { UserAuth, RefreshToken } = response.data;

        // Save new tokens
        await saveTokens(UserAuth, RefreshToken);

        // Update authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${UserAuth}`;
        originalRequest.headers["Authorization"] = `Bearer ${UserAuth}`;

        // Process queued requests
        processQueue(null, UserAuth);

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        processQueue(refreshError, null);

        // Clear tokens and redirect to login
        await clearTokens();

        // You might want to trigger a navigation to login screen here
        // For now, we'll just log the error and reject the promise
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
