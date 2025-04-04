import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Base URL for the backend
// Change this to match your backend URL and port
const API_BASE_URL = "http://10.0.0.3:8000/"; // Adjust port as needed

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
