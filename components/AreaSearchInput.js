import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { usePreferencesPayload } from '../context/PreferencesPayloadContext';
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Area search input component with autocomplete functionality
 * Uses the PreferencesPayload context to access available areas based on selected city
 */
const AreaSearchInput = ({ value, onChange, selectedCity }) => {
  // Log the incoming value to debug
  console.log('AreaSearchInput received value:', value);
  
  // Initialize searchText based on value
  const [searchText, setSearchText] = useState(value || '');
  const [showResults, setShowResults] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState([]);
  
  // Get cities data from context
  const { cities, isLoading, error } = usePreferencesPayload();
  
  // If value changes externally, update the internal state
  useEffect(() => {
    if (value) {
      console.log('Value changed in AreaSearchInput:', value);
      setSearchText(value);
    }
  }, [value]);
  
  // Get available areas based on selected city
  const getAvailableAreas = () => {
    if (!selectedCity || !selectedCity.id) return [];
    
    // Find the city in the cities array
    const city = cities.find(c => c.id === selectedCity.id);
    return city && city.areas ? city.areas : [];
  };
  
  // Filter areas based on search text
  useEffect(() => {
    if (searchText.trim() === '' || !selectedCity) {
      setFilteredAreas([]);
      return;
    }
    
    const availableAreas = getAvailableAreas();
    
    // More flexible search that shows results even with partial matches
    const searchTerms = searchText.toLowerCase().split(' ');
    
    const filtered = availableAreas.filter(area => {
      // Since areas are strings, directly use them
      const areaName = area ? area.toLowerCase() : '';
      // Check if any of the search terms are in the area name
      return searchTerms.some(term => areaName.includes(term));
    });
    
    setFilteredAreas(filtered);
  }, [searchText, selectedCity, cities]);
  
  // Handle area selection
  const handleSelectArea = (area) => {
    setSearchText(area);
    onChange(area); // Pass the area string
    setShowResults(false);
    console.log('Selected area:', area); // Log the selected area
  };
  
  // Handle text input
  const handleChangeText = (text) => {
    setSearchText(text);
    // If the text is different from the current value, update the parent
    if (text !== value) {
      onChange(null);
    }
    setShowResults(true);
  };
  
  // Show all available areas when input is focused
  const handleFocus = () => {
    if (selectedCity) {
      // Set filtered areas to all available areas for the selected city
      setFilteredAreas(getAvailableAreas());
      setShowResults(true);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleChangeText}
          placeholder="Enter area name"
          onFocus={handleFocus}
          autoCapitalize="words"
          editable={!!selectedCity} // Only enable if a city is selected
        />
        {searchText ? (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => {
              setSearchText('');
              setSelectedArea(null); // Clear the selected area object
              onChange(null); // Pass null to parent to clear the area
              setShowResults(false);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {showResults && searchText.trim() !== '' && selectedCity && (
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : error ? (
            <Text style={styles.errorText}>Error loading areas</Text>
          ) : filteredAreas.length > 0 ? (
            <ScrollView 
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {filteredAreas.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={styles.resultItem}
                  onPress={() => handleSelectArea(item)}
                >
                  <Text style={styles.resultText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noResultsText}>No matching areas found</Text>
          )}
        </View>
      )}
      
      {!selectedCity && (
        <Text style={styles.helperText}>Please select a city first</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 998, // Slightly lower z-index than city input to ensure proper layering
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'comfortaaRegular',
  },
  label: {
    marginBottom: 5,
    paddingLeft: 10,
    fontSize: 20,
    color: '#333',
    fontFamily: 'comfortaaSemiBold',
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    position: 'absolute',
    top: 55, // Position below the input field
    left: 0,
    right: 0,
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    elevation: 5, // Increased elevation for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Increased shadow opacity
    shadowRadius: 4, // Increased shadow radius
    zIndex: 999, // Very high z-index to ensure it appears above everything
  },
  resultsList: {
    width: '100%',
    maxHeight: 200,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'comfortaaRegular',
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
  helperText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'comfortaaRegular',
    color: '#666',
    textAlign: 'center',
  },
});

export default AreaSearchInput;
