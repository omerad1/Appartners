import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputField from "../../components/onBoarding/InputField";
import { useState } from "react";
const StepOne = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <OnBoardingLayout
      direction="StepTwo"
      next={true}
      title={`Welcome!
    Please Enter Your Details`}
    >
      <InputField
        placeholder="Email"
        type="email"
        onChange={(email) => {
          setEmail(email);
        }}
      />
      <InputField
        placeholder="Phone Number"
        type="tel"
        onChange={(phoneNumber) => {
          setPhoneNumber(phoneNumber);
        }}
      />
    </OnBoardingLayout>
  );
};

export default StepOne;

const styles = StyleSheet.create({});
