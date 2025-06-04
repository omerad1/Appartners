// api/user.js
import api from "./client";
import endpoints from "./endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put(`${endpoints.users}update-password/`, {
      current_password: currentPassword,
      new_password: newPassword
    });
    
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

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

// Fetch user data - first try AsyncStorage, then server if needed
export const fetchUserData = async (forceRefresh = false) => {
  try {
    // First try to get from AsyncStorage (unless forceRefresh is true)
    if (!forceRefresh) {
      const localUserData = await getUserDataFromStorage();

      if (localUserData) {
        console.log("User data found in AsyncStorage");
        return localUserData;
      }

      console.log("No user data in AsyncStorage, fetching from server...");
    } else {
      console.log("Force refresh requested, fetching user data from server...");
    }

    // Make the API call to get user profile
    const response = await api.get(endpoints.profile);

    // Log the complete user data from the response
    console.log(
      "User data from /users/me endpoint:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if the response contains user data before saving
    if (response.data) {
      // Save the user data to AsyncStorage
      await saveUserDataToStorage(response.data);
      return response.data;
    } else {
      console.warn("No user data found in response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Update user profile on the server
export const updateUserProfile = async (userData) => {
  try {
    const hasPhoto =
      userData.photo &&
      (userData.photo.uri || userData.photo.startsWith("data:"));

    let formData;

    if (hasPhoto) {
      formData = new FormData();

      if (userData.photo.uri) {
        const photoUri = userData.photo.uri;
        const filename = photoUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("photo", {
          uri: photoUri,
          name: filename,
          type,
        });
      } else if (userData.photo.startsWith("data:")) {
        // Backend-dependent handling of base64 images
        formData.append("photo", userData.photo);
      }

      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "photo") {
          formData.append(key, value);
        }
      });
    }

    const response = hasPhoto
      ? await api.put(endpoints.updateUserProfile, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : await api.put(endpoints.updateUserProfile, userData);

    if (response.data?.user) {
      await saveUserDataToStorage(response.data.user);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
