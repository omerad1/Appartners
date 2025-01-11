import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";

const SearchTags = ({ tags, selectedTags, onTagToggle }) => {
  const handleTagPress = (tag) => {
    onTagToggle(tag); // Toggle the tag in the parent component
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsWrapper}>
        {tags.map((item) => (
          <Chip
            key={item}
            mode="outlined" // Keep outlined style for border
            style={[
              styles.chip,
              selectedTags.includes(item)
                ? styles.selectedChip
                : styles.unselectedChip,
            ]}
            textStyle={[
              styles.chipText,
              selectedTags.includes(item)
                ? styles.selectedChipText
                : styles.unselectedChipText,
            ]}
            onPress={() => handleTagPress(item)}
          >
            {item}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default SearchTags;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping to the next line
    justifyContent: "flex-start", // Align tags to the start
    marginLeft: 10,
  },
  chip: {
    marginVertical: 4,
    marginHorizontal: 2,
    borderRadius: 20, // Rounded corners
    elevation: 1, // Subtle shadow for depth
    borderWidth: 1, // Add border
  },
  chipText: {
    fontSize: 11, // Smaller font size
    fontFamily: "comfortaaSemiBold",
  },
  selectedChip: {
    borderColor: "rgb(87, 87, 87)", // Dark grey border for selected state
    backgroundColor: "rgb(87, 87, 87)", // Keep background white for better contrast
  },
  unselectedChip: {
    borderColor: "#dbeeff", // Light bluish border for unselected state
    backgroundColor: "#dbeeff", // Keep background white
  },
  selectedChipText: {
    color: "#ffffff", // Dark grey text for selected state
  },
  unselectedChipText: {
    color: "#333", // Darker text for unselected state
  },
});
