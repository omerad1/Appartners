import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Chip } from "react-native-paper";

const SearchTags = ({ tags, selectedTags, onTagAdd, onTagRemove }) => {
  const [tagSearch, setTagSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  const handleTagSearch = (text) => {
    setTagSearch(text);
    if (text) {
      const filtered = tags.filter((tag) =>
        tag.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      onTagAdd(tag); // Call parent function to add the tag
    }
    setTagSearch("");
    setFilteredTags([]);
  };

  return (
    <View>
      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search Property Tag"
        value={tagSearch}
        onChangeText={handleTagSearch}
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
      />

      {/* Dropdown List */}
      {filteredTags.length > 0 && (
        <FlatList
          data={filteredTags}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleTagSelect(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}

      {/* Selected Tags Display */}
      <View style={styles.chipsContainer}>
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            mode="outlined"
            onClose={() => onTagRemove(tag)}
            style={styles.chip}
          >
            {tag}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default SearchTags;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginTop: 20,
    boxShadow: "7px 7px 5px 2px rgba(0, 0, 0, 0.1)",
  },
  dropdown: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    maxHeight: 200,
    backgroundColor: "#fff",
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  chip: {
    margin: 5,
  },
});
