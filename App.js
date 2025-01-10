import React from "react";
import { StatusBar } from "react-native";
import { StyleSheet, View, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import Title from "./components/Title";

// Example screen imports
import StepOne from "./screens/onBoarding/StepOne";
import LoginScreen from "./screens/LoginScreen";
import StepTwo from "./screens/onBoarding/StepTwo";
import StepThree from "./screens/onBoarding/StepThree";
import StepFour from "./screens/onBoarding/StepFour";
import StepFive from "./screens/onBoarding/StepFive";
import StepSix from "./screens/onBoarding/StepSix";
import StepSeven from "./screens/onBoarding/StepSeven";
import AddApartmentScreen from "./screens/addApartment/AddApartmentScreen";
import PropertyTagsScreen from "./screens/addApartment/PropertyTagsScreen";
import PhotosScreen from "./screens/addApartment/PhotosScreen";
import StepEight from "./screens/onBoarding/StepEight";
import SurveyWizard from "./screens/survey/SurveyWizard";
export default function App() {
  const [fontsLoaded] = useFonts({
    comfortaa: require("./assets/fonts/Comfortaa-Regular.ttf"),
    comfortaaBold: require("./assets/fonts/Comfortaa-Bold.ttf"),
    comfortaaLight: require("./assets/fonts/Comfortaa-Light.ttf"),
    comfortaaMedium: require("./assets/fonts/Comfortaa-Medium.ttf"),
    comfortaaSemiBold: require("./assets/fonts/Comfortaa-SemiBold.ttf"),
  });
  if (!fontsLoaded) {
    return <View />;
  }
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
        <SurveyWizard />
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
