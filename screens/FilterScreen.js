import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Keyboard,
} from "react-native";
import DrawerModal from "../components/DrawerModal";
import DatePicker from "../components/DatePicker";
import InputField from "../components/onBoarding/InputField";
import PriceRangePicker from "../components/PriceRangePicker";
import FilterSection from "../components/FilterSection";
import CitySearchInput from "../components/CitySearchInput";
import AreaSearchInput from "../components/AreaSearchInput";
import TagsSelector from "../components/TagsSelector";
import { usePreferencesPayload } from "../context/PreferencesPayloadContext";

const roommateOptions = [1, 2, 3, 4];

const SECTION_KEYS = {
  MOVE_IN_DATE: 'moveInDate',
  PRICE_RANGE: 'priceRange',
  ROOMMATES: 'roommates',
  FEATURES: 'features',
  MAX_FLOOR: 'maxFloor',
  AREA: 'area',
  CITY: 'city',

};

const defaultPriceRange = { min: 0, max: 10000 };

const FilterScreen = ({ visible = false, onClose, onApply, initialPreferences = {} }) => {
  const initializedRef = useRef(false);
  // Get all data from context at the top level
  const { cities, tags, isLoading: citiesLoading } = usePreferencesPayload();
  const safePreferences = initialPreferences || {};
  
  // Create a reference to store the original preferences
  const originalPrefs = useRef(safePreferences);
  
  // Initialize temporary form state
  const initTempForm = () => {
    // Move-in date
    const tempMoveInDate = (() => {
      if (!originalPrefs.current.move_in_date) return null;
      try {
        const date = new Date(originalPrefs.current.move_in_date);
        return !isNaN(date.getTime()) ? date : null;
      } catch (error) {
        return null;
      }
    })();
    
    // Price range
    const tempPriceRange = (() => {
      if (!originalPrefs.current.price_range) return defaultPriceRange;
      return {
        min: originalPrefs.current.price_range?.min ?? defaultPriceRange.min,
        max: originalPrefs.current.price_range?.max ?? defaultPriceRange.max
      };
    })();
    
    // Roommates
    const tempSelectedRoommates = (() => {
      if (!originalPrefs.current.number_of_roommates || !Array.isArray(originalPrefs.current.number_of_roommates)) return [];
      return originalPrefs.current.number_of_roommates
        .map(val => typeof val === 'string' ? parseInt(val, 10) : val)
        .filter(val => typeof val === 'number' && !isNaN(val));
    })();
    
    // City
    const tempCity = (() => {
      if (!originalPrefs.current.city) return "";
      
      if (typeof originalPrefs.current.city === 'object' && 
          originalPrefs.current.city.id && 
          originalPrefs.current.city.name) {
        return originalPrefs.current.city;
      }
      
      if (typeof originalPrefs.current.city === 'string') {
        const cityId = originalPrefs.current.city.trim();
        const matchingCity = cities.find(c => c.id === cityId || 
          (c.name && c.name.toLowerCase() === cityId.toLowerCase()));
        
        if (matchingCity) return matchingCity;
        return { id: cityId, name: cityId };
      }
      
      return "";
    })();
    
    // Features
    const tempSelectedFeatures = (() => {
      if (!Array.isArray(originalPrefs.current.features)) return [];
      
      // Handle features that might be objects with id and name properties
      return originalPrefs.current.features
        .filter(feature => feature !== null && feature !== undefined)
        .map(feature => {
          // If feature is an object with id, extract the id
          if (typeof feature === 'object' && feature !== null && feature.id) {
            return feature.id;
          }
          // Otherwise return the feature as is (assuming it's an id string)
          return feature;
        });
    })();
    
    // Max floor
    const tempMaxFloor = (() => {
      if (originalPrefs.current.max_floor === null || originalPrefs.current.max_floor === undefined) {
        return null;
      }
      return String(originalPrefs.current.max_floor);
    })();
    
    // Area
    const tempArea = (() => {
      if (originalPrefs.current.area === null || originalPrefs.current.area === undefined) {
        return "";
      }
      return String(originalPrefs.current.area);
    })();
    
    return {
      moveInDate: tempMoveInDate,
      priceRange: tempPriceRange,
      selectedRoommates: tempSelectedRoommates,
      city: tempCity,
      selectedFeatures: tempSelectedFeatures,
      maxFloor: tempMaxFloor,
      area: tempArea
    };
  };
  
  // Create temporary form state
  const [tempForm, setTempForm] = useState(initTempForm);
  
  // Reset form when modal becomes visible or initialPreferences change
  useEffect(() => {
    if (visible) {
      // Reset to the original data from initialPreferences
      originalPrefs.current = safePreferences;
      setTempForm(initTempForm());
      initializedRef.current = false;
    }
  }, [visible, safePreferences]);
  
  // Accessor functions for temporary form state
  const setMoveInDate = (value) => setTempForm(prev => ({ ...prev, moveInDate: value }));
  const setPriceRange = (value) => setTempForm(prev => ({ ...prev, priceRange: value }));
  
  // Special handling for roommates to ensure we always get an array
  const setSelectedRoommates = (value) => {
    setTempForm(prev => {
      // If value is a function, execute it with the current selectedRoommates
      const newValue = typeof value === 'function' 
        ? value(prev.selectedRoommates) 
        : value;
      return { ...prev, selectedRoommates: newValue };
    });
  };
  
  const setCity = (value) => setTempForm(prev => ({ ...prev, city: value }));
  const setSelectedFeatures = (value) => setTempForm(prev => ({ ...prev, selectedFeatures: value }));
  const setMaxFloor = (value) => setTempForm(prev => ({ ...prev, maxFloor: value }));
  const setArea = (value) => setTempForm(prev => ({ ...prev, area: value }));
  
  // Destructure the temporary form for easier access in the component
  const { moveInDate, priceRange, selectedRoommates, city, selectedFeatures, maxFloor, area } = tempForm;
  
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    if (visible && !initializedRef.current) {
      const sectionsToOpen = {};
      
      if (originalPrefs.current.move_in_date) sectionsToOpen[SECTION_KEYS.MOVE_IN_DATE] = true;
      if (originalPrefs.current.price_range && 
          (originalPrefs.current.price_range.min !== defaultPriceRange.min || 
           originalPrefs.current.price_range.max !== defaultPriceRange.max)) {
        sectionsToOpen[SECTION_KEYS.PRICE_RANGE] = true;
      }
      if (Array.isArray(originalPrefs.current.number_of_roommates) && originalPrefs.current.number_of_roommates.length > 0) {
        sectionsToOpen[SECTION_KEYS.ROOMMATES] = true;
      }
      if (originalPrefs.current.city) {
        sectionsToOpen[SECTION_KEYS.CITY] = true;
      }
      if (Array.isArray(originalPrefs.current.features) && originalPrefs.current.features.length > 0) {
        sectionsToOpen[SECTION_KEYS.FEATURES] = true;
      }
      if (originalPrefs.current.max_floor !== null && originalPrefs.current.max_floor !== undefined) {
        sectionsToOpen[SECTION_KEYS.MAX_FLOOR] = true;
      }
      if (originalPrefs.current.area) {
        sectionsToOpen[SECTION_KEYS.AREA] = true;
      }
      
      setOpenSections(sectionsToOpen);
      initializedRef.current = true;
    }
  }, [visible]);


  const toggleSection = (sectionKey) => {
    setOpenSections(prev => {
      const newSections = { ...prev };
      newSections[sectionKey] = !prev[sectionKey];
      return newSections;
    });
  };

  const handleToggleRoommate = (roommate) => {
    // Ensure we're working with a number
    const roommateNum = Number(roommate);
    
    // Direct approach to toggle roommates
    const currentRoommates = [...selectedRoommates]; // Create a copy of the current array
    const isSelected = currentRoommates.some(r => Number(r) === roommateNum);
    
    let newRoommates;
    if (isSelected) {
      // If selected, remove it
      newRoommates = currentRoommates.filter(r => Number(r) !== roommateNum);
    } else {
      // If not selected, add it
      newRoommates = [...currentRoommates, roommateNum];
    }
    
    // Update the state directly with the new array
    setSelectedRoommates(newRoommates);

  };

  const handleApplyFilters = () => {
    // Create the filters object with the temporary form data
    const filters = {
      area: area || null,
      city: typeof city === 'object' && city !== null ? city : null,
      // Send features as an array of IDs
      features: selectedFeatures,
      max_floor: maxFloor ? parseInt(maxFloor, 10) : null,
      move_in_date: moveInDate ? moveInDate.format('YYYY-MM-DD') : null,
      number_of_roommates: selectedRoommates,
      price_range: {
        min: priceRange.min,
        max: priceRange.max
      }
    };

    // Call the onApply callback with the filters to save them on the backend
    if (onApply) {
      onApply(filters);
    }

    // Close the modal
    if (onClose) {
      onClose();
    }
  };

  return (
    <DrawerModal
      visible={visible}
      onClose={onClose} // This will close without applying changes, and reset on next open
      title="Narrow your search"
      onSave={handleApplyFilters} // This will apply changes and then close
      saveButtonTitle="Apply Filters"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FilterSection
            title="City"
            iconName="location-outline"
            isOpen={!!openSections[SECTION_KEYS.CITY]}
            onToggle={() => toggleSection(SECTION_KEYS.CITY)}
            hasValue={!!city}
            onClear={() => {
              setCity("");
              setSelectedCity(null);
              setArea(""); // Clear area when city is cleared
            }}
          >
            <CitySearchInput
              value={city}
              onChange={setCity}
              initialValue={typeof city === 'object' && city !== null ? city.name : 
                          typeof city === 'string' ? city : ''}

            />
          </FilterSection>
          <FilterSection
            title="Preferred Area"
            iconName="map-outline"
            isOpen={!!openSections[SECTION_KEYS.AREA]}
            onToggle={() => toggleSection(SECTION_KEYS.AREA)}
            hasValue={!!area}
            onClear={() => setArea("")}
          >
            <AreaSearchInput
              value={area}
              onChange={setArea}
              selectedCity={selectedCity}
            />
          </FilterSection>
          <FilterSection
            title="Max Floor"
            iconName="business-outline"
            isOpen={!!openSections[SECTION_KEYS.MAX_FLOOR]}
            onToggle={() => toggleSection(SECTION_KEYS.MAX_FLOOR)}
            hasValue={maxFloor !== null && maxFloor !== ""}
            onClear={() => setMaxFloor("")}
          >
            <View style={styles.directInputContainer}>
              <Text style={styles.directLabel}>Maximum Floor</Text>
              <InputField
                placeholder="Enter maximum floor"
                keyboardType="numeric"
                value={maxFloor !== null && maxFloor !== undefined ? maxFloor.toString() : ""}
                onChange={setMaxFloor}
              />
            </View>
          </FilterSection>
          <FilterSection
            title="Move-in Date"
            iconName="calendar-outline"
            isOpen={!!openSections[SECTION_KEYS.MOVE_IN_DATE]}
            onToggle={() => toggleSection(SECTION_KEYS.MOVE_IN_DATE)}
            hasValue={!!moveInDate}
            onClear={() => setMoveInDate(null)}
          >
            <DatePicker date={moveInDate} setDate={setMoveInDate} />
          </FilterSection>
          <FilterSection
            title="Features (e.g. balcony, parking)"
            iconName="star-outline"
            isOpen={!!openSections[SECTION_KEYS.FEATURES]}
            onToggle={() => toggleSection(SECTION_KEYS.FEATURES)}
            hasValue={selectedFeatures && selectedFeatures.length > 0}
            onClear={() => setSelectedFeatures([])}
          >
            <TagsSelector
              selectedTags={selectedFeatures}
              onTagsChange={setSelectedFeatures}
            />
          </FilterSection>
          <FilterSection
            title="Price Range"
            iconName="wallet-outline"
            isOpen={!!openSections[SECTION_KEYS.PRICE_RANGE]}
            onToggle={() => toggleSection(SECTION_KEYS.PRICE_RANGE)}
            hasValue={
              priceRange.min !== defaultPriceRange.min ||
              priceRange.max !== defaultPriceRange.max
            }
            onClear={() => setPriceRange(defaultPriceRange)}
          >
            <PriceRangePicker
              initialRange={priceRange}
              onChange={setPriceRange}
            />
          </FilterSection>

          <FilterSection
            title="Number of Roommates"
            iconName="people-outline"
            isOpen={!!openSections[SECTION_KEYS.ROOMMATES]}
            onToggle={() => toggleSection(SECTION_KEYS.ROOMMATES)}
            hasValue={selectedRoommates && selectedRoommates.length > 0}
            onClear={() => setSelectedRoommates([])}
          >
            <View style={styles.roommateOptionsContainer}>
              {roommateOptions.map((option) => {
                const optionNum = Number(option);
                
                // Check if this option is selected
                const isSelected = Array.isArray(selectedRoommates) && 
                  selectedRoommates.some(val => Number(val) === optionNum);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.roommateOptionButton,
                      isSelected && styles.roommateOptionButtonSelected,

                    ]}
                    onPress={() => handleToggleRoommate(optionNum)}
                  >
                    <Text
                      style={[
                        styles.roommateOptionText,
                        isSelected && styles.roommateOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FilterSection>
        </ScrollView>
      </TouchableWithoutFeedback>
    </DrawerModal>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 70,
    paddingTop: 10,
  },

  directLabel: {
    fontSize: 18,
    fontFamily: "comfortaaSemiBold",
    color: "#333",
    marginBottom: 8,
    marginTop: 5,
  },
  directInputContainer: {
    marginBottom: 20,
  },
  roommateOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  roommateOptionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  roommateOptionButtonSelected: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  roommateOptionText: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    color: "#333",
  },
  roommateOptionTextSelected: {
    color: "#fff",
    fontFamily: "comfortaaSemiBold",
  },
  featuresPlaceholderContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  featuresPlaceholderText: {
    fontSize: 14,
    fontFamily: "comfortaaRegular",
    color: "#777",
    textAlign: "center",
  },
});

export default FilterScreen;
