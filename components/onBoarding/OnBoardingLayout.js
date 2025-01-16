import { StyleSheet, View, Image } from "react-native";
import React from "react";
import Title from "../Title";
import StepButton from "./StepButton";

const OnBoardingLayout = ({ title, children, direction, next, onPress }) => {
  return (
    <View style={styles.container}>
      {/* Centered Title */}
      <View style={styles.titleContainer}>
        <Title style={styles.title}>{title}</Title>
      </View>

      {/* Your custom input(s) or other content */}
      <View style={styles.childrenContainer}>{children}</View>

      {/* “Next” or “Prev” button pinned toward bottom */}
      <View style={styles.buttonContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/icons/logo.png")}
            style={styles.logo}
          />
        </View>
        <StepButton direction={direction} next={next} onPress={onPress} />
      </View>
    </View>
  );
};

export default OnBoardingLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,

    // Center items horizontally
    alignItems: "center",
  },
  titleContainer: {
    // Constrain width so text can wrap nicely
    width: "80%",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    color: "#333",
  },
  childrenContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  buttonContainer: {
    // Push the content above up and place this at the bottom
    marginTop: "auto",
    marginBottom: 32,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 121,
    resizeMode: "contain",
  },
});
