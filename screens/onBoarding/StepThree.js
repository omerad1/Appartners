import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { israelCities } from "../../data/cities/cities";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';

const StepThree = () => {
  const dispatch = useDispatch();
  const { location } = useSelector(state => state.onboarding);
  const [city, setCity] = useState(location || "");
  const [filteredCities, setFilteredCities] = useState([]);

  const handleSearch = (text) => {
    setCity(text);
    if (text.length > 0) {
      const filtered = israelCities.filter((city) =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const handleSelect = (selectedCity) => {
    setCity(selectedCity);
    setFilteredCities([]);
    dispatch(updateOnboardingData({ location: selectedCity }));
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
        {filteredCities.length > 0 && (
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
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
