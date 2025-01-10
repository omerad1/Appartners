import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SurveyLayout from "../../components/survey/SurveyLayout";
import StepButton from "../../components/onBoarding/StepButton";

const steps = [];

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answer, setAnswer] = useState("");

  return (
    <View style={styles.container}>
      <SurveyLayout
        step={1}
        setAnswer={setAnswer}
        title={"omer"}
        input={null}
        radioBarOptions={["omer", "omer"]}
      />
      <View style={styles.buttonContainer}>
        {/* {currentStep < steps.length - 1 ? (
          <>
            <StepButton next={false} onPress={skipStep} />
            <StepButton next={true} onPress={nextStep} />
          </>
        ) : (
          <StepButton
            next={true}
            onPress={() => alert(JSON.stringify(answers, null, 2))}
          />
        )} */}
      </View>
    </View>
  );
};

export default Wizard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});
