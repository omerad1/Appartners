import endpoints from "../endpoints";
import api from "../client"

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put(endpoints.users.updatePassword , {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
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
        ? await api.put(endpoints.users.updateProfile, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.put(endpoints.users.updateProfile, userData);
  
      if (response.data?.user) {
        await saveUserDataToStorage(response.data.user);
      }
  
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };