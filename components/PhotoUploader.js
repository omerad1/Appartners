import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Title from "./Title";

const PhotoUploader = () => {
  const [photos, setPhotos] = useState([]); // Store selected photos
  let images = [];

  const handleAddPhoto = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access photos is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: images,
      allowsMultipleSelection: false, // Change to true if you want multiple photo selection
      quality: 1, // High quality
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0]]); // Add selected photo to the state
    }
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1); // Remove the photo at the specified index
    setPhotos(updatedPhotos);
  };

  const renderPhotoItem = ({ item, index }) => {
    if (item) {
      // Display uploaded photo with delete button
      return (
        <View style={styles.photoContainer}>
          <Image source={{ uri: item.uri }} style={styles.photo} />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePhoto(index)}
          >
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      // Placeholder for adding photos
      return (
        <TouchableOpacity style={styles.placeholder} onPress={handleAddPhoto}>
          <MaterialIcons
            name="add-photo-alternate"
            size={30}
            color="rgb(104, 104, 104)"
          />
        </TouchableOpacity>
      );
    }
  };

  // Start with 6 placeholders and expand as needed
  const data = [...photos, ...Array(Math.max(6 - photos.length, 0)).fill(null)];

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Photos</Title>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderPhotoItem}
        numColumns={3} // Show 3 items per row
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

export default PhotoUploader;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  photoContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    bottom: 3,
    right: 3,
    backgroundColor: "rgba(54, 54, 54, 0.3)",
    borderRadius: 10,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
