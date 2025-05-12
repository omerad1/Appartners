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

const roommateOptions = [1, 2, 3, 4];

const SECTION_KEYS = {
  MOVE_IN_DATE: 'moveInDate',
  PRICE_RANGE: 'priceRange',
  ROOMMATES: 'roommates',
  FEATURES: 'features',
  MAX_FLOOR: 'maxFloor',
  AREA: 'area',
};

const defaultPriceRange = { min: 0, max: 10000 };

// A much simpler implementation to avoid the infinite loop
const FilterScreen = ({ visible = false, onClose, onApply, initialPreferences = {} }) => {
  // Track if we've already initialized the sections to avoid re-initialization
  const initializedRef = useRef(false);
  
  // Basic state setup
  const [moveInDate, setMoveInDate] = useState(initialPreferences.moveInDate || null);
  const [priceRange, setPriceRange] = useState(initialPreferences.priceRange || defaultPriceRange);
  const [selectedRoommates, setSelectedRoommates] = useState(initialPreferences.number_of_roommates || []); 
  
  // For city, we need to ensure it's properly initialized as an object
  // If it comes from the backend as just an ID or name, we'll need to convert it
  const [city, setCity] = useState(() => {
    // Log what we're receiving for debugging
    console.log('Initial city value:', initialPreferences.city);
    return initialPreferences.city || "";
  });
  
  // For features/tags, we need to ensure we're using IDs instead of names
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    console.log('Initial features value:', initialPreferences.features);
    // Make sure we're using an array of feature IDs
    return initialPreferences.features || [];
  }); 
  
  const [maxFloor, setMaxFloor] = useState(initialPreferences.max_floor ? String(initialPreferences.max_floor) : "");
  const [area, setArea] = useState(initialPreferences.area || "");
  
  // Initialize openSections with an empty object
  const [openSections, setOpenSections] = useState({});

  // A single useEffect to handle initial sections opening
  useEffect(() => {
    // Skip initialization if we've already done it
    if (visible && !initializedRef.current) {
      const sectionsToOpen = {};
      
      // Check each preference and open its section if it has a value
      if (initialPreferences.moveInDate) sectionsToOpen[SECTION_KEYS.MOVE_IN_DATE] = true;
      if (initialPreferences.priceRange && 
          (initialPreferences.priceRange.min !== defaultPriceRange.min || 
           initialPreferences.priceRange.max !== defaultPriceRange.max)) {
        sectionsToOpen[SECTION_KEYS.PRICE_RANGE] = true;
      }
      if (initialPreferences.number_of_roommates && initialPreferences.number_of_roommates.length > 0) {
        sectionsToOpen[SECTION_KEYS.ROOMMATES] = true;
      }
      if (initialPreferences.features && initialPreferences.features.length > 0) {
        sectionsToOpen[SECTION_KEYS.FEATURES] = true;
      }
      if (initialPreferences.max_floor) sectionsToOpen[SECTION_KEYS.MAX_FLOOR] = true;
      if (initialPreferences.area) sectionsToOpen[SECTION_KEYS.AREA] = true;
      
      // Only update state if we have sections to open
      if (Object.keys(sectionsToOpen).length > 0) {
        setOpenSections(sectionsToOpen);
      }
      
      // Mark as initialized
      initializedRef.current = true;
    }
    
    // Reset initialization flag when modal is closed
    if (!visible) {
      initializedRef.current = false;
    }
  }, [visible]); // ONLY depend on visible state, nothing else

  const toggleSection = (sectionKey) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [sectionKey]: !prevOpenSections[sectionKey],
    }));
  };

  const handleToggleRoommate = (option) => {
    setSelectedRoommates((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option].sort((a,b) => a-b)
    );
  };

  const handleApplyFilters = () => {
    const parsedMaxFloor = parseInt(maxFloor);
    const filters = {
      moveInDate,
      priceRange,
      number_of_roommates: selectedRoommates,
      city, // Keep the entire city object in the state
      features: selectedFeatures,
      max_floor: maxFloor && !isNaN(parsedMaxFloor) ? parsedMaxFloor : null,
      area: area || null,
    };
    console.log("Filters applied:", filters);
    if (onApply) onApply(filters);
    if (onClose) onClose();
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
            isOpen={true}
            onToggle={() => toggleSection(SECTION_KEYS.CITY)}
            hasValue={!!city}
            onClear={() => setCity("")}
          >
            <CitySearchInput
              value={city}
              onChange={(selectedCity) => {
                console.log('Selected city in FilterScreen:', selectedCity);
                setCity(selectedCity);
              }}
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
            iconName="stats-chart-outline"
            isOpen={!!openSections[SECTION_KEYS.MAX_FLOOR]}
            onToggle={() => toggleSection(SECTION_KEYS.MAX_FLOOR)}
            hasValue={!!maxFloor}
            onClear={() => setMaxFloor("")}
          >
            <InputField
              placeholder="Enter max floor"
              type="numeric"
              onChange={setMaxFloor}
              value={maxFloor}
            />
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
              {roommateOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.roommateOptionButton,
                    selectedRoommates.includes(option) && styles.roommateOptionButtonSelected,
                  ]}
                  onPress={() => handleToggleRoommate(option)}
                >
                  <Text
                    style={[
                      styles.roommateOptionText,
                      selectedRoommates.includes(option) && styles.roommateOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
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
