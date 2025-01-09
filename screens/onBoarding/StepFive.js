import React, { useState } from "react";
import { StyleSheet } from "react-native";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import TextArea from "../../components/TextArea";

const StepFive = () => {
  const [enteredValue, setEnteredValue] = useState("");

  return (
    <OnBoardingLayout
      title={"What Would You Like Others To Know About You?"}
      next={true}
      direction={"StepSix"}
    >
      <TextArea
        placeholder={"About me"}
        value={enteredValue}
        onChange={setEnteredValue}
      />
    </OnBoardingLayout>
  );
};

export default StepFive;

const styles = StyleSheet.create({});
