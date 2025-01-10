import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ProgressBar, MD3Colors } from "react-native-paper";
import Title from "../Title";
import InputField from "../onBoarding/InputField";
import StepButton from "../onBoarding/StepButton";
import LikertScale from "./LikertScale";

// input is an array of objects with placeholder and type and onChange
// radioBarOptions is an array of 2 objects with labels for the first and last radio buttons
const SurveyLayout = ({ step, setAnswer, title, input, radioBarOptions }) => {
  return (
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
        input.map((item, index) => (
          <InputField
            key={index}
            placeholder={item.placeholder}
            type={item.type}
            onChange={setAnswer}
          />
        ))}

      {/* Likert Scale */}
      {radioBarOptions && (
        <View style={styles.likertContainer}>
          <LikertScale
            title1={radioBarOptions[0]}
            title5={radioBarOptions[1]}
            onSelect={setAnswer}
          />
        </View>
      )}

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <StepButton next={false} onPress={() => console.log("Skip pressed")} />
        <StepButton next={true} onPress={() => console.log("Next pressed")} />
      </View>
    </View>
  );
};

export default SurveyLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  progressBar: {
    marginTop: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
  likertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 300,
    height: 172,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
