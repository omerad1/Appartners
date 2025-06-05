import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ProgressBar, MD3Colors } from "react-native-paper";
import Title from "../general/Title";
import InputField from "../onBoarding/InputField";
import LikertScale from "./LikertScale";
import BackgroundImage from "../layouts/BackgroundImage";
import StepButton from "../onBoarding/StepButton";
import KeyboardAwareWrapper from "../layouts/KeyboardAwareWrapper";

// input is an array of objects with placeholder and type and onChange
// radioBarOptions is an array of 2 objects with labels for the first and last radio buttons
const SurveyLayout = ({ 
  step, 
  setAnswer, 
  title, 
  input, 
  radioBarOptions,
  onNext,
  onFinish,
  isLastStep,
  currentAnswer // Add current answer prop
 }) => {
  // Determine if we need to use KeyboardAwareWrapper (for input fields)
  const needsKeyboardAware = input && input.length > 0;
  
  const content = (
    <View style={styles.container}>
      {/* Progress Bar */}
      <ProgressBar
        style={styles.progressBar}
        progress={step / 10}
        color={MD3Colors.primary10}
      />

      {/* Title */}
      <Title>{title}</Title>

      {/* Input Fields */}
      
      {input &&
      <View style={styles.inputContainer}>
        {input.map((item, index) => (
          <View key={`input-${index}`}>
            <Text style={styles.subTitle}>{item.title}</Text>
            <InputField
              placeholder={item.placeholder}
              type={item.type}
              onChange={setAnswer}
              value={currentAnswer || ""}
            />
          </View>
        ))}
      </View>
      }

      {/* Likert Scale */}
      {radioBarOptions && (
        <View style={styles.likertContainer}>
          <LikertScale
            title1={radioBarOptions[0]}
            title5={radioBarOptions[1]}
            onSelect={setAnswer}
            initialValue={currentAnswer}
          />
        </View>
      )}
      
  
      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <StepButton
          next={true}
          text={isLastStep ? "Finish" : "Next"}
          onPress={isLastStep ? onFinish : onNext}
        />
      </View>
    </View>
  );
  
  return (
    <BackgroundImage opacity={0.45}>
      {needsKeyboardAware ? (
        <KeyboardAwareWrapper>
          {content}
        </KeyboardAwareWrapper>
      ) : (
        content
      )}
    </BackgroundImage>
  );
};

export default SurveyLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  progressBar: {
    marginBottom: 16,
    marginTop: 0,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
  likertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 7,
    
  },
  logo: {
    width: 300,
    height: 172,
    resizeMode: "contain",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 50,
    marginTop: 20,
  },
});
