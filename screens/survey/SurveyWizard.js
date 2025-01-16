import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SurveyLayout from "../../components/survey/SurveyLayout";
import StepButton from "../../components/onBoarding/StepButton";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const steps = [
  {
    title: "What Are You Studying?",
    input: [
      {
        title: "What Is Your Major/Field Of Study?",
        placeholder: "Enter your major",
        type: "text",
      },
      {
        title: "Which Year Are You In?",
        placeholder: "Year",
        type: "text",
      },
    ],
  },
  {
    title: "On Average, How Often Do You Clean Your Living Space?",
    radioBarOptions: ["Rarely", "Very Often"],
  },
  {
    title:
      "How Often Do You Have Friends Over, And Do You Mind If Roomates Host Guests?",
    radioBarOptions: ["Rarely", "Very Often"],
  },
  {
    title:
      "How Comfortable Are You With Discussing And Resolving Household Issues Openly?",
    radioBarOptions: [`Not Comfortable At All`, "Extremely Comfortable"],
  },
  {
    title: "What Percentage Of Your Time Do You Spend In Your Room?",
    radioBarOptions: ["0%", "100%"],
  },
  {
    title:
      "Do You Prefer Handling Shared Chores By A Schedule Or More Informally?",
    radioBarOptions: ["Schedule", "Informal"],
  },
  {
    title:
      "How Important Is Having A Quiet, Study-Friendly Environment To You?",
    radioBarOptions: ["Not Important", "Extremely Important"],
  },
  {
    title: "How Do You Feel About Pets In The Apartment?",
    radioBarOptions: ["Strongly Opposed", "I Love Pets!"],
  },
  {
    title: "Do You Prefer To Buy Groceries Together Or Separately?",
    radioBarOptions: ["Always Separately", "Always Together"],
  },
];

const Wizard = () => {
  const navigation = useNavigation();
  const onFinish = () => {
    alert(JSON.stringify(answers, null, 2));
    navigation.navigate("MainApp");
  };
  // Initialize default answers
  const defaultAnswers = steps.reduce((acc, step, index) => {
    if (step.radioBarOptions) {
      acc[index] = 3; // Default value for scales
    } else if (step.input) {
      acc[index] = ""; // Default value for inputs
    }
    return acc;
  }, {});

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);

  const setAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const skipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(251, 251, 251, 0.73)",
          "rgba(255, 255, 255, 0.6)",
          "rgba(255, 255, 255, 0.08)",
        ]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <SurveyLayout
            step={currentStep + 1}
            setAnswer={setAnswer}
            title={steps[currentStep].title}
            input={steps[currentStep].input || null}
            radioBarOptions={steps[currentStep].radioBarOptions || null}
          />
          <View style={styles.buttonContainer}>
            {currentStep < steps.length - 1 ? (
              <>
                <StepButton next={false} text="Skip" onPress={skipStep} />
                <StepButton next={true} text="Next" onPress={nextStep} />
              </>
            ) : (
              <StepButton next={true} onPress={onFinish} />
            )}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
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
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});
