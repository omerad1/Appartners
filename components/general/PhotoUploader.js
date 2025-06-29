import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const PhotoUploader = ({ onChange, initialPhotos = [] }) => {
  const [photos, setPhotos] = useState([]); // Store selected photos

  // Process initial photos when component mounts
  useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      const formattedPhotos = initialPhotos.map((url) => ({
        uri: url,
        isExisting: true, // Flag to identify existing photos
      }));
      setPhotos(formattedPhotos);
    }
  }, [initialPhotos]);

  // Notify parent component when photos change
  useEffect(() => {
    if (onChange) {
      onChange(photos);
    }
  }, [photos, onChange]);

  const handleAddPhoto = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access photos is required!");
      return;
    }

    // Launch the image picker with multiselect enabled
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10, // Limit to 10 photos at a time
    });

    if (!result.canceled) {
      // Add all selected photos to the state
      setPhotos([...photos, ...result.assets]);
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
          <Text style={styles.placeholderText}>Add Photos</Text>
        </TouchableOpacity>
      );
    }
  };

  // Ensure at least one placeholder is always displayed
  const data = [...photos, null];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderPhotoItem}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 10,
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
    padding: 10,
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
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
    top: 3,
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

export default PhotoUploader;
