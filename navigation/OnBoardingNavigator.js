import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: "comfortaaBold",
        },
        headerBackTitleVisible: true,
        headerBackTitle: "Back",
        headerTintColor: "black",
        contentStyle: { ImageBackground: "transparent" },
        presentation: "card",
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
  );
};

export default OnBoardingNavigator;
