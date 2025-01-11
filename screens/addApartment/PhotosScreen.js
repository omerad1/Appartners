import React from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import Title from "../../components/Title";
import PhotoUploader from "../../components/PhotoUploader"; // Import the PhotoUploader component

const PhotosScreen = () => {
  const data = [{ key: "content" }]; // Placeholder for non-list content

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
        />
        <Title>Upload Photos</Title>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={() => (
          <View style={styles.photoUploaderContainer}>
            <PhotoUploader />
          </View>
        )}
        contentContainerStyle={styles.scrollContainer}
      />
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhotosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust for bottom padding
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 60,
    margin: 10,
  },
  photoUploaderContainer: {
    width: "90%", // Full width
    paddingHorizontal: 10,
  },
  nextButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#000000",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
