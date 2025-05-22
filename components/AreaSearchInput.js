import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePreferencesPayload } from "../context/PreferencesPayloadContext";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Area dropdown selector component
 * Uses the PreferencesPayload context to access available areas based on selected city
 */
const AreaSearchInput = ({ value, onChange, selectedCity }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedArea, setSelectedArea] = useState(value || null);

  // Get cities data from context
  const { cities, isLoading, error } = usePreferencesPayload();

  // Get available areas based on selected city
  const getAvailableAreas = () => {
    if (!selectedCity || !selectedCity.id) return [];

    // Find the city in the cities array
    const city = cities.find((c) => c.id === selectedCity.id);
    return city && city.areas ? city.areas : [];
  };

  // Update selectedArea when value changes externally
  useEffect(() => {
    if (value) {
      setSelectedArea(value);
    } else {
      setSelectedArea(null);
    }
  }, [value]);

  // Handle area selection
  const handleSelectArea = (area) => {
    setSelectedArea(area);
    onChange(area);
    setShowDropdown(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (selectedCity) {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdownButton, !selectedCity && styles.disabledButton]}
        onPress={toggleDropdown}
        disabled={!selectedCity}
      >
        <Text
          style={[styles.selectedText, !selectedArea && styles.placeholderText]}
        >
          {selectedArea || "Select area"}
        </Text>
        <Ionicons
          name={showDropdown ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {selectedArea && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            setSelectedArea(null);
            onChange(null);
          }}
        >
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}

      {showDropdown && (
        <View style={styles.dropdown}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : error ? (
            <Text style={styles.errorText}>Error loading areas</Text>
          ) : (
            <ScrollView
              style={styles.dropdownScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {getAvailableAreas().length > 0 ? (
                getAvailableAreas().map((area, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    style={styles.dropdownItem}
                    onPress={() => handleSelectArea(area)}
                  >
                    <Text style={styles.dropdownItemText}>{area}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>
                  No areas available for this city
                </Text>
              )}
            </ScrollView>
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
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
  },
  selectedText: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdown: {
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
  dropdownScroll: {
    width: "100%",
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
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
  clearButton: {
    position: "absolute",
    right: 45,
    top: 15,
    padding: 5,
    zIndex: 1000,
  },
});

export default AreaSearchInput;
