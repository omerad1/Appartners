import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StepOne from "../screens/onBoarding/StepOne";
import StepTwo from "../screens/onBoarding/StepTwo";
import StepThree from "../screens/onBoarding/StepThree";
import StepFour from "../screens/onBoarding/StepFour";
import StepFive from "../screens/onBoarding/StepFive";
import StepSix from "../screens/onBoarding/StepSix";
import StepSeven from "../screens/onBoarding/StepSeven";
import StepEight from "../screens/onBoarding/StepEight";

const Stack = createStackNavigator();

const OnBoardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StepOne" component={StepOne} />
      <Stack.Screen name="StepTwo" component={StepTwo} />
      <Stack.Screen name="StepThree" component={StepThree} />
      <Stack.Screen name="StepFour" component={StepFour} />
      <Stack.Screen name="StepFive" component={StepFive} />
      <Stack.Screen name="StepSix" component={StepSix} />
      <Stack.Screen name="StepSeven" component={StepSeven} />
      <Stack.Screen name="StepEight" component={StepEight} />
    </Stack.Navigator>
  );
};

export default OnBoardingNavigator;
