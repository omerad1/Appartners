import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Platform } from "react-native";
import PhotoUploader from "../../../components/PhotoUploader";
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackgroundImage from "../../../components/BackgroundImage";
import { createApartment } from "../../../api/createApartment";
import { updateApartment } from "../../../api/updateApartment";
import { Card, ActivityIndicator, Chip, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PhotosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get params with default values to prevent undefined errors
  const {
    formData: routeFormData = {},
    entryDay = new Date().toISOString().split("T")[0],
    selectedTags = [],
    isEditing = false,
    apartmentId,
    apartment,
  } = route.params || {};

  // Create a local state copy of formData that we can update
  const [formData, setFormData] = useState(routeFormData);
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Log full navigation state to debug
  useEffect(() => {
    console.log("Navigation state:", navigation.getState());
    console.log("Current route:", route);
    console.log("Route params received:", route.params);
    console.log("formData from route:", routeFormData);

    // Try to load saved form data from AsyncStorage
    loadSavedFormData();
  }, []);

  // Load form data from AsyncStorage as a backupf
  const loadSavedFormData = async () => {
    try {
      const savedFormData = await AsyncStorage.getItem("apartmentFormData");
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        console.log("Loaded saved form data:", parsedData);

        // Check if we're missing required fields in the route params but have them in storage
        if (
          !routeFormData ||
          Object.keys(routeFormData).length === 0 ||
          !routeFormData.city ||
          !routeFormData.street ||
          !routeFormData.floor ||
          !routeFormData.totalPrice
        ) {
          console.log(
            "Route formData is missing required fields, using saved data from AsyncStorage"
          );

          // Use the saved data as our primary source of truth in this case
          setFormData(parsedData);
        } else {
          // We have data from both sources, merge with preference for route data
          const mergedFormData = {
            ...parsedData,
            ...routeFormData, // Let route params override stored data if both exist
          };

          console.log("Merged form data:", mergedFormData);
          setFormData(mergedFormData);
        }
      } else {
        console.log("No saved form data found in AsyncStorage");

        // If we don't have saved data but do have route params, use those
        if (routeFormData && Object.keys(routeFormData).length > 0) {
          setFormData(routeFormData);
        } else {
          // If we have nothing, set a flag to warn the user
          console.error("No form data available from any source");
        }
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    } finally {
      setDataLoaded(true);
    }
  };

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

  // Function to go back to apartment details entry
  const handleGoBack = () => {
    navigation.navigate("AddApartmentScreen", {
      apartment: apartment,
      isEditing: isEditing,
    });
  };

  // Validate that required fields are present and have valid values
  const validateFormData = () => {
    const requiredFields = ["city", "street", "floor", "totalPrice"];

    // First check if formData is empty
    if (!formData || Object.keys(formData).length === 0) {
      console.error("Form data is completely empty");
      Alert.alert(
        "Missing Information",
        "No apartment information has been entered. Please go back and fill in the required details.",
        [
          {
            text: "Go Back to Details",
            onPress: handleGoBack,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return false;
    }

    // Check for missing fields or fields with empty values
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];
      // Check if the field is missing or empty (after trimming if it's a string)
      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      );
    });

    if (missingFields.length > 0) {
      console.error(
        "Missing required fields:",
        missingFields,
        "Current formData:",
        formData
      );
      Alert.alert(
        "Missing Information",
        `The following required fields are missing or empty: ${missingFields.join(
          ", "
        )}. Would you like to go back and enter them?`,
        [
          {
            text: "Go Back to Details",
            onPress: handleGoBack,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return false;
    }

    // All required fields are present and non-empty
    return true;
  };

  const prepareFormData = () => {
    // Validate formData has required fields
    if (!validateFormData()) {
      throw new Error("Missing required fields");
    }

    // Create a FormData object for multipart/form-data submission
    const apiFormData = new FormData();

    // Add required fields with proper type conversion
    apiFormData.append("city", parseInt(formData.city, 10));
    apiFormData.append("street", formData.street);
    apiFormData.append("type", formData.apartmentType || "apartment");
    apiFormData.append("floor", parseInt(formData.floor, 10));
    apiFormData.append("number_of_rooms", parseInt(formData.rooms || 1, 10));
    apiFormData.append(
      "available_rooms",
      parseInt(formData.availableRooms || 1, 10)
    );
    apiFormData.append("total_price", parseFloat(formData.totalPrice));
    apiFormData.append("available_entry_date", entryDay.split("T")[0]);

    // Add optional fields if they exist
    if (formData.about) {
      apiFormData.append("about", formData.about);
    }

    if (formData.area) {
      apiFormData.append("area", formData.area);
    }

    if (formData.buildingNumber) {
      apiFormData.append("house_number", parseInt(formData.buildingNumber, 10));
    }

    // Add features/tags if they exist
    if (selectedTags && selectedTags.length > 0) {
      selectedTags.forEach((tag, index) => {
        const tagId = typeof tag === "number" ? tag : parseInt(tag, 10);
        apiFormData.append(`features[${index}]`, tagId);
      });
    }

    // Handle photos
    // First, add existing photos if editing
    if (isEditing && existingPhotos && existingPhotos.length > 0) {
      existingPhotos.forEach((url, index) => {
        apiFormData.append(`existing_photos[${index}]`, url);
      });
    }

    // Then add new photos
    if (photos && photos.length > 0) {
      photos.forEach((photo, index) => {
        // Skip photos that are already in existingPhotos
        if (photo.isExisting) return;

        // Create file object from URI
        const photoFile = {
          uri:
            Platform.OS === "ios"
              ? photo.uri.replace("file://", "")
              : photo.uri,
          type: photo.mimeType || "image/jpeg",
          name: photo.fileName || `photo_${index}.jpg`,
        };

        // Log the photo file for debugging
        console.log(`Appending photo ${index}:`, photoFile);

        // Append the photo file to FormData
        apiFormData.append("photos", photoFile);
      });
    }

    // Log the complete form data for debugging
    console.log("Complete form data:", {
      city: parseInt(formData.city, 10),
      street: formData.street,
      type: formData.apartmentType || "apartment",
      floor: parseInt(formData.floor, 10),
      number_of_rooms: parseInt(formData.rooms || 1, 10),
      available_rooms: parseInt(formData.availableRooms || 1, 10),
      total_price: parseFloat(formData.totalPrice),
      available_entry_date: entryDay.split("T")[0],
      about: formData.about || undefined,
      area: formData.area || undefined,
      house_number: formData.buildingNumber
        ? parseInt(formData.buildingNumber, 10)
        : undefined,
      features:
        selectedTags?.map((tag) =>
          typeof tag === "number" ? tag : parseInt(tag, 10)
        ) || [],
      existingPhotoCount: existingPhotos?.length || 0,
      newPhotoCount: photos?.filter((p) => !p.isExisting)?.length || 0,
      photos: photos
        ?.filter((p) => !p.isExisting)
        ?.map((p) => ({
          uri: Platform.OS === "ios" ? p.uri.replace("file://", "") : p.uri,
          type: p.mimeType || "image/jpeg",
          name: p.fileName || "photo.jpg",
        })),
    });

    // Log the actual FormData contents
    console.log("FormData contents:", apiFormData._parts);

    return apiFormData;
  };

  const handleSubmit = async () => {
    try {
      // First validate required fields
      if (!validateFormData()) {
        return;
      }

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

      // Clear the saved form data on successful submission
      try {
        await AsyncStorage.removeItem("apartmentFormData");
      } catch (error) {
        console.error("Error clearing saved form data:", error);
      }

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

  // Return loading until we've checked for saved form data
  if (!dataLoaded) {
    return (
      <BackgroundImage>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text style={styles.loadingText}>Loading apartment data...</Text>
        </View>
      </BackgroundImage>
    );
  }
  7;

  return (
    <BackgroundImage>
      <AddApartmentLayout
        title={"Upload Photos"}
        next={!isSubmitting}
        onPress={handleSubmit}
        text={isEditing ? "Update" : "Finish"}
      >
        <LinearGradient
          colors={["rgba(212, 183, 162, 0.7)", "rgba(150, 111, 93, 0.85)"]}
          style={styles.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.instruction}>
              {isEditing
                ? "Update or add photos of your apartment"
                : "Upload photos of your apartment"}
            </Text>
          </View>

          {/* Show data status */}
          <View style={styles.dataStatusContainer}>
            <Text style={styles.dataStatus}>
              {formData.city &&
              formData.street &&
              formData.floor &&
              formData.totalPrice
                ? `Adding apartment on ${formData.street}`
                : "Some required apartment details are missing"}
            </Text>
            {(!formData.city ||
              !formData.street ||
              !formData.floor ||
              !formData.totalPrice) && (
              <Button
                mode="contained"
                onPress={handleGoBack}
                style={styles.backButton}
                labelStyle={{ color: "white" }}
              >
                Return to Details
              </Button>
            )}
          </View>

          {isEditing && existingPhotos.length > 0 && (
            <View style={styles.summaryContainer}>
              <Chip
                icon="image"
                style={styles.chip}
                mode="outlined"
                textStyle={styles.chipText}
              >
                {existingPhotos.length} existing photos
              </Chip>
              <Text style={styles.noteText}>
                You can add more photos or replace existing ones
              </Text>
            </View>
          )}

          <View style={styles.photoFrame}>
            {/* No ScrollView here to avoid nesting VirtualizedLists */}
            <View style={styles.photoUploaderContainer}>
              <PhotoUploader
                onChange={handlePhotosChange}
                initialPhotos={existingPhotos}
              />
            </View>
          </View>

          {isSubmitting && (
            <View style={styles.loadingContainer}>
              <LinearGradient
                colors={[
                  "rgba(139, 69, 19, 0.57)",
                  "rgba(148, 148, 148, 0.95)",
                ]}
                style={styles.loadingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>
                  {isEditing
                    ? "Updating apartment..."
                    : "Creating apartment..."}
                </Text>
              </LinearGradient>
            </View>
          )}

          {!isSubmitting && (
            <View style={styles.tipContainer}>
              <Ionicons name="bulb-outline" size={22} color="#8B4513" />
              <Text style={styles.tipText}>
                Tip: Well-lit photos make your apartment stand out!
              </Text>
            </View>
          )}
        </LinearGradient>
      </AddApartmentLayout>
    </BackgroundImage>
  );
};

export default PhotosScreen;

const styles = StyleSheet.create({
  gradientCard: {
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(177, 108, 58, 0.11)",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  headerIcon: {
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 20,
  },
  instruction: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "comfortaaSemiBold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dataStatusContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  dataStatus: {
    color: "#5D4037",
    fontFamily: "comfortaaSemiBold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: "#8B4513",
    marginTop: 5,
  },
  summaryContainer: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  chip: {
    marginBottom: 8,
    backgroundColor: "rgba(139, 69, 19, 0.1)",
    borderColor: "#8B4513",
    paddingHorizontal: 5,
  },
  chipText: {
    color: "#8B4513",
    fontWeight: "600",
  },
  noteText: {
    fontSize: 13,
    color: "#5D4037",
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "500",
  },
  photoFrame: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: "rgba(139, 69, 19, 0.5)",
    borderStyle: "dashed",
    overflow: "hidden",
    minHeight: 350,
  },
  photoUploaderContainer: {
    width: "100%",
    paddingHorizontal: 8,
    minHeight: 330,
    zIndex: 1,
  },
  loadingContainer: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  loadingText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "comfortaaSemiBold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 248, 220, 0.9)",
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#8B4513",
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#5D4037",
    fontFamily: "comfortaaSemiBold",
    flexShrink: 1,
  },
});
