import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Searchbar } from "react-native-paper";
import SearchTags from "../../../components/SearchTags";
import { propertyTags } from "../../../data/tags/propertyTags";
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackgroundImage from "../../../components/BackgroundImage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PropertyTagsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData, entryDay, isEditing, apartmentId } = route.params || {};
  const editingApartment =
    route.params?.apartment || route.params?.formData?.apartment;

  // Get existing tags if editing
  const [existingTags, setExistingTags] = useState([]);

  // Check for saved form data when component mounts
  useEffect(() => {
    // Debug log route params
    console.log("PropertyTagsScreen - route params:", route.params);
    console.log("formData received in PropertyTagsScreen:", formData);

    // Load saved form data from AsyncStorage if needed
    const loadSavedFormData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("apartmentFormData");
        if (savedData) {
          console.log("Found saved form data in PropertyTagsScreen");
        }
      } catch (error) {
        console.error("Error checking saved form data:", error);
      }
    };

    loadSavedFormData();
  }, []);

  useEffect(() => {
    if (isEditing && editingApartment?.feature_details) {
      // Log for debugging
      console.log("Feature details:", editingApartment.feature_details);

      // Extract feature names from feature_details
      const tags = editingApartment.feature_details
        .map((feature) =>
          typeof feature === "object" ? feature.name : feature
        )
        .filter((tag) => tag); // Filter out any undefined/null values

      setExistingTags(tags);
      setSelectedTags(tags);
    }
  }, [isEditing, editingApartment]);

  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags
  const [showAll, setShowAll] = useState(false); // Control showing all tags
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [filteredTags, setFilteredTags] = useState(propertyTags.slice(0, 10)); // Filtered tags

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item) => item !== tag)); // Remove tag if selected
    } else {
      setSelectedTags([...selectedTags, tag]); // Add tag if not selected
    }
  };

  const handleShowMore = () => {
    setShowAll(!showAll); // Toggle showing all tags
    if (!showAll) {
      setFilteredTags(propertyTags); // Show all tags
    } else {
      setFilteredTags(propertyTags.slice(0, 10)); // Reset to default 10 tags
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      // If search is cleared, show only the first 10 tags
      setFilteredTags(propertyTags.slice(0, 10));
      setShowAll(false); // Reset the showAll state
    } else {
      // Filter tags based on the search query
      const filtered = propertyTags.filter((tag) =>
        tag.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  };

  const handleNext = async () => {
    // Update the saved form data with the selected tags
    try {
      // First, get the existing form data to ensure we're not losing anything
      const savedData = await AsyncStorage.getItem("apartmentFormData");
      let dataToSave = formData || {};

      // If we have saved data, use it as a base
      if (savedData) {
        dataToSave = {
          ...JSON.parse(savedData),
          ...dataToSave, // Override with current route formData
        };
      }

      // Add the selected tags
      dataToSave = {
        ...dataToSave,
        tags: selectedTags,
      };

      // Save the updated data
      await AsyncStorage.setItem(
        "apartmentFormData",
        JSON.stringify(dataToSave)
      );
      console.log("Saved form data with tags:", dataToSave);
    } catch (error) {
      console.error("Error saving form data with tags:", error);
    }

    // Navigate to the next screen with all collected data
    navigation.navigate("PhotosScreen", {
      formData,
      entryDay,
      selectedTags,
      isEditing,
      apartmentId,
      apartment: editingApartment,
    });
  };

  const isShowMoreDisabled =
    searchQuery.trim() !== "" || propertyTags.length <= 10;

  return (
    <BackgroundImage>
      <AddApartmentLayout
        title={"Select Property Tags"}
        direction={"PhotosScreen"}
        next={true}
        onPress={handleNext}
      >
        <View style={styles.container}>
          <Text style={styles.instruction}>
            Select features that your apartment has:
          </Text>
          {isEditing && existingTags.length > 0 && (
            <Text style={styles.currentTagsText}>
              Currently selected: {existingTags.length} features
            </Text>
          )}
          <Searchbar
            placeholder="Search tags..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View>
              <SearchTags
                tags={filteredTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
              {!searchQuery.trim() && propertyTags.length > 10 && (
                <TouchableOpacity
                  style={[
                    styles.showMoreButton,
                    isShowMoreDisabled && styles.disabledButton,
                  ]}
                  onPress={handleShowMore}
                  disabled={isShowMoreDisabled}
                >
                  <Text style={styles.showMoreText}>
                    {showAll ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </AddApartmentLayout>
    </BackgroundImage>
  );
};

export default PropertyTagsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
    fontFamily: "comfortaaSemiBold",
  },
  currentTagsText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    color: "#555",
    fontFamily: "comfortaa",
    fontStyle: "italic",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50, // Prevent overlap with the Next button
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBar: {
    marginBottom: 15,
    marginHorizontal: 14,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    elevation: 2,
  },
  showMoreButton: {
    alignSelf: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 20, // Adjusted for separation
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#aaa", // Grey out the button
  },
  showMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
