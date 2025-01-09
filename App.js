import React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Example screen imports
import StepTwo from "./screens/onBoarding/StepTwo";
import StepThree from "./screens/onBoarding/StepThree";

export default function App() {
  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.imageBackground}
      resizeMode="cover" // or "stretch" / "contain" depending on your preference
    >
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.35)", // 80% opacity white
          "rgba(255, 251, 204, 0.35)", // 80% opacity soft yellow
          "rgba(191, 163, 116, 0.35)", // 80% opacity brown
          "rgba(0, 0, 0, 0.35)", // 80% opacity black
        ]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Render the rest of your app screens inside the gradient */}
        <StepThree />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1, // Ensures the background image covers the entire screen
  },
  container: {
    flex: 1,
    // any other styling you want
  },
});
