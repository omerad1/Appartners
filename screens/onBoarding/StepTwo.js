import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputField from "../../components/onBoarding/InputField";
import { useState } from "react";
const StepTwo = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <OnBoardingLayout
      direction="StepThree"
      next={true}
      title="What Is Your Name?"
    >
      <InputField
        placeholder="First Name"
        type="text"
        onChange={(firstName) => {
          setFirstName(firstName);
        }}
      />
      <InputField
        placeholder="Last Name"
        type="text"
        onChange={(lastName) => {
          setLastName(lastName);
        }}
      />
    </OnBoardingLayout>
  );
};

export default StepTwo;

const styles = StyleSheet.create({});
