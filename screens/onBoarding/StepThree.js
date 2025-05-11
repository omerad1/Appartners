import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';
import { usePreferencesPayload } from '../../context/PreferencesPayloadContext';

const StepThree = () => {
  const dispatch = useDispatch();
  const { location } = useSelector(state => state.onboarding);
  const [city, setCity] = useState(location || "");
  const [filteredCities, setFilteredCities] = useState([]);
  
  // Get cities data from context
  const { cities, isLoading, error } = usePreferencesPayload();

  const handleSearch = (text) => {
    setCity(text);
    if (text.length > 0) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelect = (selectedCity) => {
    setCity(selectedCity.name);
    setFilteredCities([]);
    dispatch(updateOnboardingData({ location: selectedCity.name, cityId: selectedCity.id }));
  };

  const handleNext = () => {
    if (!city) {
      // Show error if no city selected
      return false;
    }
    dispatch(updateOnboardingData({ location: city }));
    return true;
  };

  return (
    <OnBoardingLayout
      direction="StepFour"
      next={true}
      title="In Which Location Would You Like To Start Your Search?"
      onPress={handleNext}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={handleSearch}
          placeholderTextColor="rgba(0, 0, 0, 0.48)"
        />
        {isLoading ? (
          <View style={[styles.dropdown, styles.loadingContainer]}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        ) : error ? (
          <View style={[styles.dropdown, styles.errorContainer]}>
            <Text style={styles.errorText}>Error loading cities</Text>
          </View>
        ) : filteredCities.length > 0 && (
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
          />
        )}
      </View>
    </OnBoardingLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  container: {
    position: "relative",
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
});

export default StepThree;
