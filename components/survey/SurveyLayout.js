import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ProgressBar, MD3Colors } from "react-native-paper";
import Title from "../Title";
import InputField from "../onBoarding/InputField";
import LikertScale from "./LikertScale";
import BackgroundImage from "../BackgroundImage";

// input is an array of objects with placeholder and type and onChange
// radioBarOptions is an array of 2 objects with labels for the first and last radio buttons
const SurveyLayout = ({ step, setAnswer, title, input, radioBarOptions }) => {
  return (
    <BackgroundImage>
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
            <View key={`input-${index}`}>
              <Text style={styles.subTitle}>{item.title}</Text>
              <InputField
                placeholder={item.placeholder}
                type={item.type}
                onChange={setAnswer}
              />
            </View>
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
      </View>
    </BackgroundImage>
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
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",

    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
