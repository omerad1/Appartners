import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import StepOne from "../screens/onBoarding/StepOne";
import StepTwo from "../screens/onBoarding/StepTwo";
import StepThree from "../screens/onBoarding/StepThree";
import StepFour from "../screens/onBoarding/StepFour";
import StepFive from "../screens/onBoarding/StepFive";
import StepSix from "../screens/onBoarding/StepSix";
import StepSeven from "../screens/onBoarding/StepSeven";
import StepEight from "../screens/onBoarding/StepEight";
import SurveyWizard from "../screens/survey/SurveyWizard";

const Stack = createStackNavigator();

const OnBoardingNavigator = () => {
  return (
    <View style={styles.overlay}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            elevation: 0, // Remove shadow for Android
            shadowOpacity: 0, // Remove shadow for iOS
          },
          headerTitleStyle: {
            fontFamily: "comfortaaBold",
          },
          headerBackTitleVisible: true,
          headerBackTitle: "Back",
          headerTintColor: "black",
        }}
      >
        <Stack.Screen
          name="StepOne"
          component={StepOne}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="StepTwo"
          component={StepTwo}
          options={{ title: "Name" }}
        />
        <Stack.Screen
          name="StepThree"
          component={StepThree}
          options={{ title: "Location" }}
        />
        <Stack.Screen
          name="StepFour"
          component={StepFour}
          options={{ title: "Password" }}
        />
        <Stack.Screen
          name="StepFive"
          component={StepFive}
          options={{ title: "About You" }}
        />
        <Stack.Screen
          name="StepSix"
          component={StepSix}
          options={{ title: "Preferences" }}
        />
        <Stack.Screen
          name="StepSeven"
          component={StepSeven}
          options={{ title: "Photos" }}
        />
        <Stack.Screen
          name="StepEight"
          component={StepEight}
          options={{ title: "Final Step" }}
        />
        <Stack.Screen
          name="Survey"
          component={SurveyWizard}
          options={{ title: "Survey" }}
        />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Optional overlay for better text contrast
  },
});

export default OnBoardingNavigator;
