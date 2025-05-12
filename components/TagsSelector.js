import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { usePreferencesPayload } from '../context/PreferencesPayloadContext';
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Tags selector component with search functionality
 * Uses the PreferencesPayload context to access available tags
 */
const TagsSelector = ({ selectedTags = [], onTagsChange }) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const [normalizedSelectedTags, setNormalizedSelectedTags] = useState([]);
  
  // Get tags data from context
  const { tags, isLoading, error } = usePreferencesPayload();
  
  // Normalize selected tags to ensure they're all IDs
  // This handles backward compatibility with existing data
  useEffect(() => {
    if (!tags || tags.length === 0 || !selectedTags || selectedTags.length === 0) {
      setNormalizedSelectedTags([]);
      return;
    }
    
    console.log('Normalizing selected tags:', selectedTags);
    
    // Convert any tag names to IDs
    const normalized = selectedTags.map(tag => {
      // If it's already an ID that exists in our tags array, keep it
      if (tags.some(t => t.id === tag)) {
        return tag;
      }
      
      // If it's a name, find the corresponding ID
      const matchingTag = tags.find(t => t.name === tag);
      if (matchingTag) {
        console.log(`Converting tag name '${tag}' to ID '${matchingTag.id}'`);
        return matchingTag.id;
      }
      
      // If we can't find a match, keep the original value
      console.log(`Could not find matching tag for '${tag}'`);
      return tag;
    });
    
    setNormalizedSelectedTags(normalized);
    
    // If we made any conversions, update the parent
    if (JSON.stringify(normalized) !== JSON.stringify(selectedTags)) {
      console.log('Updating parent with normalized tags');
      onTagsChange(normalized);
    }
  }, [selectedTags, tags]);
  
  // Filter tags based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredTags(tags);
      return;
    }
    
    // More flexible search that shows results even with partial matches
    const searchTerms = searchText.toLowerCase().split(' ');
    const filtered = tags.filter(tag => {
      const tagName = tag.name.toLowerCase();
      return searchTerms.some(term => tagName.includes(term));
    });
    setFilteredTags(filtered);
  }, [searchText, tags]);
  
  // Initialize filtered tags with all tags when component mounts
  useEffect(() => {
    if (tags && tags.length > 0) {
      setFilteredTags(tags);
    }
  }, [tags]);
  
  // Toggle tag selection
  const handleToggleTag = (tag) => {
    console.log('Toggle tag:', tag);
    if (normalizedSelectedTags.includes(tag.id)) {
      // Remove tag if already selected
      onTagsChange(normalizedSelectedTags.filter(id => id !== tag.id));
    } else {
      // Add tag if not selected
      onTagsChange([...normalizedSelectedTags, tag.id]);
    }
  };
  
  // Remove a selected tag
  const handleRemoveTag = (tagId) => {
    console.log('Remove tag ID:', tagId);
    onTagsChange(normalizedSelectedTags.filter(id => id !== tagId));
  };
  
  // Helper function to get tag name from ID
  const getTagNameById = (tagId) => {
    // First try to find the tag by ID
    const tag = tags.find(t => t.id === tagId);
    if (tag) return tag.name;
    
    // If not found by ID, try to find by name (for backward compatibility)
    // This handles the case where tagId might actually be a name
    const tagByName = tags.find(t => t.name === tagId);
    if (tagByName) return tagByName.name;
    
    // If all else fails
    console.log(`Could not find tag name for ID: ${tagId}`);
    return 'Unknown';
  };
  
  // Render selected tags as a grid without FlatList
  const renderSelectedTags = () => {
    // Group tags into rows of 3
    const rows = [];
    for (let i = 0; i < normalizedSelectedTags.length; i += 3) {
      const row = normalizedSelectedTags.slice(i, i + 3);
      rows.push(row);
    }
    
    return rows.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.tagsFlexContainer}>
        {row.map(tagId => (
          <View key={tagId} style={styles.selectedTag}>
            <Text style={styles.selectedTagText}>{getTagNameById(tagId)}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveTag(tagId)}
              style={styles.removeTagButton}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    ));
  };
  
  return (
    <View style={styles.container}>
      {/* Selected Tags Display */}
      {normalizedSelectedTags.length > 0 && (
        <View style={styles.selectedTagsWrapper}>
          <Text style={styles.selectedTagsTitle}>Selected Features:</Text>
          <ScrollView 
            style={styles.selectedTagsContainer}
            contentContainerStyle={styles.selectedTagsContent}
            showsVerticalScrollIndicator={true}
          >
            {renderSelectedTags()}
          </ScrollView>
        </View>
      )}
      
      {/* Search Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for features (e.g. balcony, parking)"
          onFocus={() => setShowResults(true)}
        />
        {searchText ? (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => setSearchText('')}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Tags Results */}
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : error ? (
          <Text style={styles.errorText}>Error loading features</Text>
        ) : filteredTags.length > 0 ? (
          <ScrollView 
            style={styles.tagsScrollContainer}
            contentContainerStyle={styles.tagsGrid}
            showsVerticalScrollIndicator={true}
          >
            {filteredTags.map(item => (
              <TouchableOpacity
                key={item.id.toString()}
                style={[
                  styles.tagItem,
                  normalizedSelectedTags.includes(item.id) && styles.tagItemSelected
                ]}
                onPress={() => handleToggleTag(item)}
              >
                <Text style={[
                  styles.tagText,
                  normalizedSelectedTags.includes(item.id) && styles.tagTextSelected
                ]}>
                  {item.name}
                </Text>
                {normalizedSelectedTags.includes(item.id) && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResultsText}>No matching features found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectedTagsWrapper: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  selectedTagsTitle: {
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
    marginBottom: 8,
    color: '#333',
  },
  selectedTagsContainer: {
    maxHeight: 100, // Capped at a reasonable default size
  },
  selectedTagsContent: {
    paddingVertical: 5,
  },
  tagsFlexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    marginRight: 5,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'comfortaaRegular',
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    width: '100%',
    height: 200, // Fixed height for consistency
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 5,
  },
  tagsScrollContainer: {
    flex: 1,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  tagItemSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#333',
  },
  tagTextSelected: {
    color: '#fff',
    fontFamily: 'comfortaaSemiBold',
  },
  noResultsText: {
    padding: 15,
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    padding: 15,
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: 'red',
    textAlign: 'center',
  },
});

export default TagsSelector;
