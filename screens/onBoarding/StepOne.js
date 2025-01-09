import OnBoardingLayout from "../../components/OnBoardingLayout";
import { StyleSheet, Text, View } from "react-native";
import React from "react";

const StepOne = () => {
  return (
    <OnBoardingLayout
      direction="StepTwo"
      next={true}
      title="Welcome! Please Enter Your Details"
    >
      <Text>StepOne</Text>
    </OnBoardingLayout>
  );
};

export default StepOne;

const styles = StyleSheet.create({});
