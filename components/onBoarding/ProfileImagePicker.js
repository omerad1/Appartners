import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ProfileImagePicker = ({ profileImage, setProfileImage }) => {
  const handleImagePick = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the media library."
      );
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [1, 1], // Ensure the selected image is square
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      // Update the profile image state with the selected image URI
      console.log(result.assets[0].uri);
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Profile Picture</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {profileImage ? (
          // Display the selected image
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          // Display a placeholder when no image is selected
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={36} color="#aaa" />
            <Text style={styles.placeholderText}>Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileImagePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
    fontWeight: "600",
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // Adds shadow on Android
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 14,
    color: "#aaa",
  },
});
