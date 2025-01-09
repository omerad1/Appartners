import { StyleSheet } from "react-native";
import React, { useState } from "react";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import InputField from "../../components/onBoarding/InputField";

const StepFive = () => {
  const [enteredValue, setEnteredValue] = useState("");

  const handleInputChange = (value) => {
    setEnteredValue(value);
  };

  return (
    <OnBoardingLayout
      title={"What would you like others to know about you?"}
      next={true}
      direction={"StepSix"}
    >
      <InputField
        placeholder={"About me"}
        type={"default"} // Use "default" for plain text input
        onChange={handleInputChange}
      />
    </OnBoardingLayout>
  );
};

export default StepFive;

const styles = StyleSheet.create({});
