import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputField from "../../components/onBoarding/InputField";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';

const StepTwo = () => {
  const dispatch = useDispatch();
  const { firstName, lastName } = useSelector(state => state.onboarding);
  

  const handleNext = () => {
    if (!firstName || !lastName) {
      // Show error if fields are empty
      return;
    }
    return true;
  };

  return (
    <OnBoardingLayout
      direction="StepThree"
      next={true}
      title="What Is Your Name?"
      onPress={handleNext}
    >
      <InputField
        placeholder="First Name"
        type="text"
        value={firstName}
        onChange={(value) => {
          dispatch(updateOnboardingData({ firstName: value }));
        }}
      />
      <InputField
        placeholder="Last Name"
        type="text"
        value={lastName}
        onChange={(value) => {
          dispatch(updateOnboardingData({ lastName: value }));
        }}
      />
    </OnBoardingLayout>
  );
};

export default StepTwo;

const styles = StyleSheet.create({});
