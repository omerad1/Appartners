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

// A much simpler implementation to avoid the infinite loop
const FilterScreen = ({ visible = false, onClose, onApply, initialPreferences = {} }) => {
  // Track if we've already initialized the sections to avoid re-initialization
  const initializedRef = useRef(false);
  
  // Get cities from the context
  const { cities, isLoading: citiesLoading } = usePreferencesPayload();
  
  // Ensure initialPreferences is not null and log it for debugging
  const safePreferences = initialPreferences || {};
  
  // Log all incoming preferences data with type information
  console.log('FilterScreen - Initial preferences data:', JSON.stringify(safePreferences, null, 2));
  console.log('FilterScreen - number_of_roommates type:', Array.isArray(safePreferences.number_of_roommates) ? 
    'Array[' + safePreferences.number_of_roommates.map(item => typeof item).join(', ') + ']' : 
    typeof safePreferences.number_of_roommates);
  console.log('FilterScreen - city type:', typeof safePreferences.city);
  console.log('FilterScreen - max_floor type:', typeof safePreferences.max_floor);
  console.log('FilterScreen - Available cities:', cities.length);
  
  // Debug the structure of the preferences data
  console.log('PREFERENCES STRUCTURE CHECK:');
  if (safePreferences.moveInDate) console.log('- moveInDate:', safePreferences.moveInDate);
  if (safePreferences.priceRange) console.log('- priceRange:', JSON.stringify(safePreferences.priceRange));
  if (safePreferences.number_of_roommates) console.log('- number_of_roommates:', JSON.stringify(safePreferences.number_of_roommates));
  if (safePreferences.city) console.log('- city:', JSON.stringify(safePreferences.city));
  if (safePreferences.features) console.log('- features:', JSON.stringify(safePreferences.features));
  if (safePreferences.max_floor) console.log('- max_floor:', safePreferences.max_floor);
  if (safePreferences.area) console.log('- area:', safePreferences.area);

  
  // Basic state setup with proper type handling
  const [moveInDate, setMoveInDate] = useState(() => {
    // Handle date string conversion if needed
    if (safePreferences.moveInDate) {
      console.log('FilterScreen - Move-in date:', safePreferences.moveInDate);
      try {
        // Try to parse the date
        const date = new Date(safePreferences.moveInDate);
        // Check if it's a valid date
        if (!isNaN(date.getTime())) {
          console.log('FilterScreen - Parsed move-in date:', date);
          return date;
        }
      } catch (error) {
        console.error('Error parsing move-in date:', error);
      }
    }
    console.log('FilterScreen - No valid move-in date found');
    return null;
  });
  
  const [priceRange, setPriceRange] = useState(() => {
    console.log('FilterScreen - Original price range:', safePreferences.priceRange);
    
    // Check if we have a valid price range object
    if (safePreferences.priceRange && typeof safePreferences.priceRange === 'object') {
      const min = safePreferences.priceRange.min !== undefined && safePreferences.priceRange.min !== null
        ? Number(safePreferences.priceRange.min)
        : defaultPriceRange.min;
        
      const max = safePreferences.priceRange.max !== undefined && safePreferences.priceRange.max !== null
        ? Number(safePreferences.priceRange.max)
        : defaultPriceRange.max;
      
      console.log('FilterScreen - Parsed price range:', { min, max });
      return { min, max };
    }
    
    console.log('FilterScreen - Using default price range');
    return defaultPriceRange;
  });
  
  // For roommates, ensure it's an array of numbers
  const [selectedRoommates, setSelectedRoommates] = useState(() => {
    console.log('FilterScreen - Roommates data:', safePreferences.number_of_roommates);
    
    // Ensure roommates is an array of numbers
    if (Array.isArray(safePreferences.number_of_roommates)) {
      // Convert any string values to numbers and filter out invalid values
      const roommates = safePreferences.number_of_roommates
        .map(val => {
          // Handle different types of values
          if (typeof val === 'number') return val;
          if (typeof val === 'string') {
            const numVal = parseInt(val, 10);
            return isNaN(numVal) ? null : numVal;
          }
          return null;
        })
        .filter(val => val !== null);
      
      console.log('FilterScreen - FINAL ROOMMATES ARRAY:', roommates);
      return roommates;
    }
    
    console.log('FilterScreen - No valid roommates data found');
    return [];
  }); 
  
  // For city, handle it as a string or object
  const [city, setCity] = useState(() => {
    console.log('FilterScreen - City data:', safePreferences.city);
    
    // City can be a string, object with id/name, or null
    if (typeof safePreferences.city === 'object' && safePreferences.city !== null) {
      // If it's already an object with id and name, use it directly
      if (safePreferences.city.id && safePreferences.city.name) {
        console.log('FilterScreen - Using city object with UUID:', safePreferences.city.id);
        return safePreferences.city;
      }
    } 
    
    // If it's a string ID, try to find the matching city object by ID
    if (typeof safePreferences.city === 'string' && safePreferences.city.trim() !== '') {
      const cityId = safePreferences.city.trim();
      console.log('FilterScreen - Looking for city with ID:', cityId);
      
      // First try to find by ID
      const matchingCityById = cities.find(c => c.id === cityId);
      if (matchingCityById) {
        console.log('FilterScreen - Found city by ID:', matchingCityById.name);
        return matchingCityById;
      }
      
      // If not found by ID, try to find by name
      const matchingCityByName = cities.find(c => 
        c.name && c.name.toLowerCase() === cityId.toLowerCase());
      if (matchingCityByName) {
        console.log('FilterScreen - Found city by name:', matchingCityByName.name);
        return matchingCityByName;
      }
      
      // If still not found, create a simple object
      console.log('FilterScreen - Creating temporary city object with ID:', cityId);
      return { id: cityId, name: cityId };
    }
    
    console.log('FilterScreen - No valid city data found');
    return "";
  });
  
  // For features/tags, we need to ensure we're using IDs instead of names
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    console.log('FilterScreen - Features data:', safePreferences.features);
    
    if (Array.isArray(safePreferences.features)) {
      // Filter out any null or undefined values
      const validFeatures = safePreferences.features.filter(feature => feature !== null && feature !== undefined);
      console.log('FilterScreen - Parsed features:', validFeatures);
      return validFeatures;
    }
    
    console.log('FilterScreen - No valid features data found');
    return [];
  }); 
  
  // For max floor, handle it as a string or number, but keep null as null
  const [maxFloor, setMaxFloor] = useState(() => {
    console.log('FilterScreen - Max floor data:', safePreferences.max_floor);
    
    // If max_floor is null or undefined, return null
    if (safePreferences.max_floor === null || safePreferences.max_floor === undefined) {
      console.log('FilterScreen - No max floor data found');
      return null;
    }
    
    // Convert to string
    const maxFloorStr = safePreferences.max_floor.toString();
    console.log('FilterScreen - Parsed max floor:', maxFloorStr);
    return maxFloorStr;
  });
  
  const [area, setArea] = useState(() => {
    console.log('FilterScreen - Area data:', safePreferences.area);
    
    // If area is null or undefined, return empty string
    if (safePreferences.area === null || safePreferences.area === undefined) {
      console.log('FilterScreen - No area data found');
      return "";
    }
    
    // Convert to string
    const areaStr = safePreferences.area.toString();
    console.log('FilterScreen - Parsed area:', areaStr);
    return areaStr;
  });
  
  // Initialize openSections with an empty object
  const [openSections, setOpenSections] = useState({});

  // Initialize sections when component becomes visible
  useEffect(() => {
    if (visible && !initializedRef.current) {
      console.log('Initializing filter sections with data:', safePreferences);
      
      const sectionsToOpen = {};
      
      // Check each preference and open its section if it has a value
      if (safePreferences.moveInDate) sectionsToOpen[SECTION_KEYS.MOVE_IN_DATE] = true;
      
      if (safePreferences.priceRange && 
          (safePreferences.priceRange.min !== defaultPriceRange.min || 
           safePreferences.priceRange.max !== defaultPriceRange.max)) {
        sectionsToOpen[SECTION_KEYS.PRICE_RANGE] = true;
      }
      
      if (Array.isArray(safePreferences.number_of_roommates) && safePreferences.number_of_roommates.length > 0) {
        console.log('OPENING ROOMMATES SECTION - Data found:', safePreferences.number_of_roommates);
        sectionsToOpen[SECTION_KEYS.ROOMMATES] = true;
      }
      
      if (safePreferences.city) {
        console.log('OPENING CITY SECTION - Data found:', safePreferences.city);
        sectionsToOpen[SECTION_KEYS.CITY] = true;
      }
      
      if (Array.isArray(safePreferences.features) && safePreferences.features.length > 0) {
        sectionsToOpen[SECTION_KEYS.FEATURES] = true;
      }
      
      if (safePreferences.max_floor !== null && safePreferences.max_floor !== undefined) {
        console.log('OPENING MAX FLOOR SECTION - Data found:', safePreferences.max_floor);
        sectionsToOpen[SECTION_KEYS.MAX_FLOOR] = true;
      }
      
      if (safePreferences.area) {
        sectionsToOpen[SECTION_KEYS.AREA] = true;
      }
      
      setOpenSections(sectionsToOpen);
      initializedRef.current = true;
    }
  }, [visible, safePreferences]);

  const toggleSection = (sectionKey) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [sectionKey]: !prevOpenSections[sectionKey],
    }));
  };

  // Toggle roommate selection
  const handleToggleRoommate = (roommate) => {
    console.log('Toggling roommate:', roommate, typeof roommate);
    // Ensure roommate is a number
    const roommateNum = Number(roommate);
    
    setSelectedRoommates((prev) => {
      // Check if this roommate is already selected (using numeric comparison)
      const isSelected = prev.some(r => Number(r) === roommateNum);
      console.log('Is roommate already selected?', isSelected);
      
      if (isSelected) {
        // Remove the roommate
        console.log('Removing roommate:', roommateNum);
        return prev.filter(r => Number(r) !== roommateNum);
      } else {
        // Add the roommate
        console.log('Adding roommate:', roommateNum);
        return [...prev, roommateNum];
      }
    });
  };

  const handleApplyFilters = () => {
    // Extract the city UUID directly
    let cityUuid = null;
    
    if (typeof city === 'object' && city !== null) {
      // If city is an object, extract the UUID directly
      cityUuid = city.id;
      console.log('CITY UUID EXTRACTED:', cityUuid);
    }
    
    // Prepare the filters object
    const filters = {
      // Format the date as dd-mm-yy for API consumption
      moveInDate: moveInDate ? moveInDate.format('DD-MM-YY') : null,
      priceRange,
      number_of_roommates: selectedRoommates,
      city: cityUuid, // Use ONLY the UUID
      features: selectedFeatures,
      max_floor: maxFloor ? parseInt(maxFloor, 10) : null,
      area: area || null,
    };
    
    console.log('FINAL FILTERS BEING SENT:', JSON.stringify(filters, null, 2));

    // Log the filters being applied
    console.log('FilterScreen - Applying filters:', JSON.stringify(filters, null, 2));

    // Call the onApply callback with the filters
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
      onClose={onClose}
      title="Narrow your search"
      onSave={handleApplyFilters}
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
            onClear={() => setCity("")}
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
            <InputField
              placeholder="Enter preferred area/neighborhood"
              onChange={setArea}
              value={area}
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
            hasValue={selectedFeatures.length > 0}
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
            hasValue={priceRange.min !== defaultPriceRange.min || priceRange.max !== defaultPriceRange.max}
            onClear={() => setPriceRange(defaultPriceRange)}
          >
            <PriceRangePicker initialRange={priceRange} onChange={setPriceRange} />
          </FilterSection>

          <FilterSection
            title="Number of Roommates"
            iconName="people-outline"
            isOpen={!!openSections[SECTION_KEYS.ROOMMATES]}
            onToggle={() => toggleSection(SECTION_KEYS.ROOMMATES)}
            hasValue={selectedRoommates.length > 0}
            onClear={() => setSelectedRoommates([])}
          >
            <View style={styles.roommateOptionsContainer}>
              {roommateOptions.map((option) => {
                // Convert option to number for consistent comparison
                const optionNum = Number(option);
                
                // Force log the current state of selectedRoommates
                console.log(`CURRENT ROOMMATES ARRAY: ${JSON.stringify(selectedRoommates)}`);
                
                // Check if this option is selected by comparing numbers
                const isSelected = selectedRoommates.includes(optionNum) || 
                                  selectedRoommates.includes(String(optionNum)) ||
                                  selectedRoommates.some(val => Number(val) === optionNum);
                                  
                console.log(`Roommate option ${option} (${typeof option}): ${isSelected ? 'SELECTED' : 'NOT SELECTED'}`);
                
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
    fontFamily: 'comfortaaSemiBold',
    color: '#333',
    marginBottom: 8,
    marginTop: 5, 
  },
  directInputContainer: {
    marginBottom: 20,
  },
  roommateOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  roommateOptionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 50, 
    alignItems: 'center',
  },
  roommateOptionButtonSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  roommateOptionText: {
    fontSize: 16,
    fontFamily: 'comfortaaRegular',
    color: '#333',
  },
  roommateOptionTextSelected: {
    color: '#fff',
    fontFamily: 'comfortaaSemiBold',
  },
  featuresPlaceholderContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  featuresPlaceholderText: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#777',
    textAlign: 'center',
  },
});

export default FilterScreen;
