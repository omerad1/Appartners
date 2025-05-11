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
 * City search input component with autocomplete functionality
 * Uses the PreferencesPayload context to access available cities
 */
const CitySearchInput = ({ value, onChange }) => {
  const [searchText, setSearchText] = useState(value && typeof value === 'object' ? value.name : value || '');
  const [showResults, setShowResults] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  
  // Get cities data from context
  const { cities, isLoading, error } = usePreferencesPayload();
  
  // Filter cities based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCities([]);
      return;
    }
    
    // More flexible search that shows results even with partial matches
    const searchTerms = searchText.toLowerCase().split(' ');
    
    const filtered = cities.filter(city => {
      // Make sure city.name exists before using it
      const cityName = city.name ? city.name.toLowerCase() : '';
      // Check if any of the search terms are in the city name
      return searchTerms.some(term => cityName.includes(term));
    });
    
    setFilteredCities(filtered);
  }, [searchText, cities]);
  
  // Handle city selection
  const handleSelectCity = (city) => {
    setSearchText(city.name);
    onChange(city); // Pass the entire city object with id, name, and area
    setShowResults(false);
  };
  
  // Handle text input
  const handleChangeText = (text) => {
    setSearchText(text);
    // Only pass the text as a temporary value until a city is selected
    onChange(text);
    setShowResults(true);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleChangeText}
          placeholder="Enter city name"
          onFocus={() => setShowResults(true)}
          autoCapitalize="words"
        />
        {searchText ? (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => {
              setSearchText('');
              onChange(''); // Clear the selected city
              setShowResults(false);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {showResults && searchText.trim() !== '' && (
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : error ? (
            <Text style={styles.errorText}>Error loading cities</Text>
          ) : filteredCities.length > 0 ? (
            <ScrollView 
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {filteredCities.map(item => (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={styles.resultItem}
                  onPress={() => handleSelectCity(item)}
                >
                  <Text style={styles.resultText}>{item.name || 'Unknown city'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noResultsText}>No matching cities found</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 999, // Increased z-index to ensure dropdown appears above other elements
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
    zIndex: 1000, // Very high z-index to ensure it appears above everything
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
});

export default CitySearchInput;
