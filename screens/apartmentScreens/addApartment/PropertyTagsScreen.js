import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
const PropertyTagsScreen = () => {
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags
  const [showAll, setShowAll] = useState(false); // Control showing all tags
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [filteredTags, setFilteredTags] = useState(propertyTags.slice(0, 10)); // Filtered tags
  const navigation = useNavigation();

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

  const isShowMoreDisabled =
    searchQuery.trim() !== "" || propertyTags.length <= 10;

  return (
    <AddApartmentLayout
      title={"Select Property Tags"}
      direction={"PhotosScreen"}
      next={true}
      onPress={() => {
        navigation.navigate("PhotosScreen");
      }}
    >
      <View style={styles.container}>
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
  );
};

export default PropertyTagsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
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
    marginBottom: 10,
    marginHorizontal: 14,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
  },
  showMoreButton: {
    alignSelf: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10, // Adjusted for separation
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
