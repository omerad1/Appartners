import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import PhotoUploader from "../../../components/PhotoUploader"; // Import the PhotoUploader component
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import { useNavigation } from "@react-navigation/native";
import BackgroundImage from "../../../components/BackgroundImage";

const PhotosScreen = () => {
  const data = [{ key: "content" }]; // Placeholder for non-list content
  const navigate = useNavigation();

  return (
    <BackgroundImage>
      <AddApartmentLayout
        title={"Upload Photos"}
        next={true}
        onPress={() => {
          navigate.navigate("mainApp");
        }}
        text={"Finish"}
      >
        <View style={styles.container}>
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
        </View>
      </AddApartmentLayout>
    </BackgroundImage>
  );
};

export default PhotosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust for bottom padding
  },
  photoUploaderContainer: {
    width: "90%", // Full width
    paddingHorizontal: 10,
  },
});
