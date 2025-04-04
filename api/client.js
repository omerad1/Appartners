import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Base URL for the backend
// Change this to match your backend URL and port
const API_BASE_URL = "http://10.0.0.3:8000/";
const API_BASE_URL_Production =
  "https://appartners-backend-production.up.railway.app";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL_Production,
  timeout: 10000, // 10 seconds timeout
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
