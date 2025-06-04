import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { usePreferencesPayload } from "../../context/PreferencesPayloadContext";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Area dropdown selector component
 * Uses the PreferencesPayload context to access available areas based on selected city
 */
const AreaSearchInput = ({ value, onChange, selectedCity }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedArea, setSelectedArea] = useState(value || null);
  const [searchText, setSearchText] = useState(value || "");

  // Get cities data from context
  const { cities, isLoading, error } = usePreferencesPayload();

  // Get available areas based on selected city
  const getAvailableAreas = () => {
    if (!selectedCity || !selectedCity.id) return [];

    // Find the city in the cities array
    const city = cities.find((c) => c.id === selectedCity.id);
    return city && city.areas ? city.areas : [];
  };

  // Filter areas based on search text
  const filteredAreas = getAvailableAreas().filter((area) =>
    area.toLowerCase().includes(searchText.toLowerCase())
  );

  // Update selectedArea when value changes externally
  useEffect(() => {
    if (value) {
      setSelectedArea(value);
      setSearchText(value);
    } else {
      setSelectedArea(null);
      setSearchText("");
    }
  }, [value]);

  // Handle area selection
  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setSearchText(area);
    onChange(area);
    setShowDropdown(false);
  };

  // Handle text input
  const handleChangeText = (text) => {
    setSearchText(text);
    setShowDropdown(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleChangeText}
          placeholder="Enter area name"
          onFocus={() => setShowDropdown(true)}
          editable={!!selectedCity}
        />
        <View style={styles.buttonsContainer}>
          {searchText ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchText("");
                setSelectedArea(null);
                onChange(null);
                setShowDropdown(false);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
            disabled={!selectedCity}
          >
            <Ionicons
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color={selectedCity ? "#888" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showDropdown && selectedCity && (
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
              {filteredAreas.map((area, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={styles.resultItem}
                  onPress={() => handleSelectArea(area)}
                >
                  <Text style={styles.resultText}>{area}</Text>
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
    width: "100%",
    position: "relative",
    zIndex: 998,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    position: "relative",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: "comfortaaRegular",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 50,
  },
  clearButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  dropdownButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  resultsContainer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },
  resultsList: {
    width: "100%",
    maxHeight: 200,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
  },
  noResultsText: {
    padding: 15,
    fontSize: 14,
    fontFamily: "comfortaaRegular",
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    padding: 15,
    fontSize: 14,
    fontFamily: "comfortaaRegular",
    color: "red",
    textAlign: "center",
  },
  helperText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: "comfortaaRegular",
    color: "#666",
    textAlign: "center",
  },
});

export default AreaSearchInput;
