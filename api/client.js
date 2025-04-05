import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Base URL for the backend
// Change this to match your backend URL and port
const API_BASE_URL = "http://10.0.0.3:8000/";
const API_BASE_URL_Production =
  "https://appartners-backend-production.up.railway.app";

const api_base_tom_comp =
  "https://6e89-2a06-c701-983e-b500-c5ad-585b-3744-da2b.ngrok-free.app/";

// Create an axios instance with default config
const api = axios.create({
  baseURL: api_base_tom_comp,
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
