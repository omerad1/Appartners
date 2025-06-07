import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';
import CitySearchInput from "../../components/apartmentsComp/CitySearchInput";

const StepThree = () => {
  const dispatch = useDispatch();
  const { location } = useSelector(state => state.onboarding);
  const [selectedCity, setSelectedCity] = useState(location || "");

  const handleCityChange = (city) => {
    console.log(city)
    if (city) {
      // If a city object is selected
      setSelectedCity(city);
      dispatch(updateOnboardingData({ 
        location: city.name, 
        cityId: city.id 
      }));
    } else {
      // If the city is cleared
      setSelectedCity("");
      dispatch(updateOnboardingData({ location: "", cityId: null }));
    }
  };

  const handleNext = () => {
    if (!selectedCity) {
      // Show error if no city selected
      return false;
    }
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
        <CitySearchInput
          value={selectedCity}
          onChange={handleCityChange}
          initialValue={location}
        />
      </View>
    </OnBoardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 5,
  },
});

export default StepThree;
