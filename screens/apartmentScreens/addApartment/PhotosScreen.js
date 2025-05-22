import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Alert, Text } from "react-native";
import PhotoUploader from "../../../components/PhotoUploader";
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackgroundImage from "../../../components/BackgroundImage";
import { createApartment } from "../../../api/createApartment";
import { updateApartment } from "../../../api/updateApartment";
import { Card, ActivityIndicator, Chip } from "react-native-paper";

const PhotosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    formData,
    entryDay,
    selectedTags,
    isEditing,
    apartmentId,
    apartment,
  } = route.params || {};

  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    if (isEditing && apartment?.photo_urls && apartment.photo_urls.length > 0) {
      console.log("Existing photos:", apartment.photo_urls);
      setExistingPhotos(apartment.photo_urls);
    }
  }, [isEditing, apartment]);

  const handlePhotosChange = (newPhotos) => {
    console.log("Photos changed:", newPhotos);
    setPhotos(newPhotos);
  };

  const prepareFormData = () => {
    // Create a FormData object for multipart/form-data submission
    const apiFormData = new FormData();

    // Add basic apartment details
    apiFormData.append("city", formData.city);
    apiFormData.append("street", formData.street);
    apiFormData.append("type", formData.apartmentType || "apartment");
    apiFormData.append("floor", formData.floor);
    apiFormData.append("number_of_rooms", formData.rooms);
    apiFormData.append("available_rooms", formData.availableRooms);
    apiFormData.append("total_price", formData.totalPrice);
    apiFormData.append("available_entry_date", entryDay);

    // Add optional fields if they exist
    if (formData.buildingNumber) {
      apiFormData.append("house_number", formData.buildingNumber);
    }

    if (formData.area) {
      apiFormData.append("area", formData.area);
    }

    if (formData.about) {
      apiFormData.append("about", formData.about);
    }

    // Add features/tags
    if (selectedTags && selectedTags.length > 0) {
      selectedTags.forEach((tag, index) => {
        apiFormData.append(`features[${index}]`, tag);
      });
    }

    // Keep existing photos if editing
    if (isEditing && existingPhotos && existingPhotos.length > 0) {
      existingPhotos.forEach((url, index) => {
        apiFormData.append(`existing_photos[${index}]`, url);
      });
    }

    // Add new photos
    if (photos && photos.length > 0) {
      photos.forEach((photo, index) => {
        // Skip photos that are already in existingPhotos (have isExisting flag)
        if (photo.isExisting) return;

        // Create file object from URI
        const fileType = photo.uri.split(".").pop();
        const fileName = `photo_${index}.${fileType}`;

        apiFormData.append("photos", {
          uri: photo.uri,
          type: `image/${fileType}`,
          name: fileName,
        });
      });
    }

    // Log the form data for debugging
    console.log("Form data prepared for submission:", {
      city: formData.city,
      street: formData.street,
      type: formData.apartmentType,
      floor: formData.floor,
      rooms: formData.rooms,
      availableRooms: formData.availableRooms,
      totalPrice: formData.totalPrice,
      entryDate: entryDay,
      features: selectedTags,
      existingPhotoCount: existingPhotos?.length || 0,
      newPhotoCount: photos?.filter((p) => !p.isExisting)?.length || 0,
    });

    return apiFormData;
  };

  const handleSubmit = async () => {
    try {
      // Validate photos - need at least one photo (new or existing)
      const totalPhotos =
        (photos?.filter((p) => !p.isExisting)?.length || 0) +
        (existingPhotos?.length || 0);

      if (!isEditing && totalPhotos === 0) {
        Alert.alert("Error", "Please upload at least one photo");
        return;
      }

      setIsSubmitting(true);
      const apiFormData = prepareFormData();

      let response;
      if (isEditing) {
        console.log(`Updating apartment with ID: ${apartmentId}`);
        response = await updateApartment(apartmentId, apiFormData);
      } else {
        console.log("Creating new apartment");
        response = await createApartment(apiFormData);
      }

      console.log("API response:", response);

      Alert.alert(
        "Success",
        isEditing
          ? "Apartment updated successfully"
          : "Apartment created successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("ListApartment"),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting apartment:", error);
      Alert.alert(
        "Error",
        isEditing
          ? `Failed to update apartment: ${error.message}`
          : `Failed to create apartment: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundImage>
      <AddApartmentLayout
        title={"Upload Photos"}
        next={!isSubmitting}
        onPress={handleSubmit}
        text={isEditing ? "Update" : "Finish"}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.instruction}>
              {isEditing
                ? "Update or add photos of your apartment"
                : "Upload photos of your apartment"}
            </Text>

            {isEditing && existingPhotos.length > 0 && (
              <View style={styles.summaryContainer}>
                <Chip icon="image" style={styles.chip}>
                  {existingPhotos.length} existing photos
                </Chip>
                <Text style={styles.noteText}>
                  You can add more photos or replace existing ones
                </Text>
              </View>
            )}

            <View style={styles.container}>
              <FlatList
                data={[{ key: "content" }]}
                keyExtractor={(item) => item.key}
                renderItem={() => (
                  <View style={styles.photoUploaderContainer}>
                    <PhotoUploader
                      onChange={handlePhotosChange}
                      initialPhotos={existingPhotos}
                    />
                  </View>
                )}
                contentContainerStyle={styles.scrollContainer}
              />
            </View>
            {isSubmitting && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>
                  {isEditing
                    ? "Updating apartment..."
                    : "Creating apartment..."}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </AddApartmentLayout>
    </BackgroundImage>
  );
};

export default PhotosScreen;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
    fontFamily: "comfortaaSemiBold",
  },
  summaryContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  chip: {
    marginBottom: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust for bottom padding
  },
  photoUploaderContainer: {
    width: "100%", // Full width
    paddingHorizontal: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontFamily: "comfortaa",
  },
});
