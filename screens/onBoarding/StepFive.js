import React, { useState } from "react";
import { StyleSheet } from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import TextArea from "../../components/general/TextArea";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';

const StepFive = () => {
  const dispatch = useDispatch();
  const { aboutMe } = useSelector(state => state.onboarding);
  const [enteredValue, setEnteredValue] = useState(aboutMe || "");

  const handleChange = (value) => {
    setEnteredValue(value);
    dispatch(updateOnboardingData({ aboutMe: value }));
  };

  const handleNext = () => {
    if (!enteredValue.trim()) {
      // Show error if about me is empty
      return false;
    }
    return true;
  };

  return (
    <OnBoardingLayout
      title={"What Would You Like Others To Know About You?"}
      next={true}
      direction={"StepSix"}
      onPress={handleNext}
    >
      <TextArea
        placeholder={"About me"}
        value={enteredValue}
        onChange={handleChange}
      />
    </OnBoardingLayout>
  );
};

export default StepFive;

const styles = StyleSheet.create({});
