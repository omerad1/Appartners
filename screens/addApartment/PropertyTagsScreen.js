import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Searchbar } from "react-native-paper";
import SearchTags from "../../components/SearchTags"; // Import the SearchTags component
import { propertyTags } from "../../data/tags/propertyTags"; // Import the property tags array
import Title from "../../components/Title";

const PropertyTagsScreen = () => {
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

  const isShowMoreDisabled =
    searchQuery.trim() !== "" || propertyTags.length <= 10;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
        />
        <Title style={styles.title}>Select Property Tags</Title>
      </View>
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
      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyTagsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
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
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 60,
    margin: 10,
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
