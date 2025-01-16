import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputField from "../../components/onBoarding/InputField";
import { useState } from "react";
const StepEight = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <OnBoardingLayout
      direction="Survey"
      next={true}
      title={`Now, You'll answer a few questions to help others get to know you better and to make the matching process more accurate and personalized. Feel free to skip any questions at any time!`}
    ></OnBoardingLayout>
  );
};

export default StepEight;

const styles = StyleSheet.create({});
