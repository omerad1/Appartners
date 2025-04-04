// api/auth.js
import api from "./client";
import endpoints from "./endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email, password) => {
  try {
    const res = await api.post(endpoints.login, { email, password });
    console.log("Login successful:", res.data);

    await AsyncStorage.setItem("authToken", res.data.UserAuth);
    console.log("Login successful");
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("Login error:", message);
    throw new Error(message);
  }
};
