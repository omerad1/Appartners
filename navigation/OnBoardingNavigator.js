import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Animated } from "react-native";
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

// Custom sequential animation that first hides current screen then shows next
const sequentialTransition = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 400 },
    },
    close: {
      animation: 'timing',
      config: { duration: 400 },
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    // For the current (outgoing) screen
    const currentOpacity = current.progress.interpolate({
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0, 0, 1],
      extrapolate: 'clamp',
    });
    
    const currentTranslateX = current.progress.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [-layouts.screen.width, -layouts.screen.width, 0],
      extrapolate: 'clamp',
    });

    // For the next (incoming) screen
    const nextOpacity = next ? 
      next.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }) : 0;
    
    const nextTranslateX = next ?
      next.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [layouts.screen.width, layouts.screen.width, 0],
        extrapolate: 'clamp',
      }) : 0;

    return {
      cardStyle: {
        opacity: currentOpacity,
        transform: [{ translateX: currentTranslateX }],
        zIndex: 0,
      },
      overlayStyle: {
        opacity: 0,
      },
      nextCardStyle: next ? {
        opacity: nextOpacity,
        transform: [{ translateX: nextTranslateX }],
        zIndex: 1,
      } : undefined,
    };
  },
};

const OnBoardingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="StepOne"
      screenOptions={{
        ...sequentialTransition,
        headerShown: true,
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontFamily: 'comfortaaSemiBold',
        },
        headerTintColor: '#333',
        // cardStyle: { backgroundColor: 'transparent' },
        animationEnabled: true,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="StepOne" component={StepOne} options={{ title: "Welcome" }} />
      <Stack.Screen name="StepTwo" component={StepTwo} options={{ title: "Name" }} />
      <Stack.Screen name="StepThree" component={StepThree} options={{ title: "Location" }} />
      <Stack.Screen name="StepFour" component={StepFour} options={{ title: "Details" }} />
      <Stack.Screen name="StepFive" component={StepFive} options={{ title: "About You" }} />
      <Stack.Screen name="StepSix" component={StepSix} options={{ title: "Password" }} />
      <Stack.Screen name="StepSeven" component={StepSeven} options={{ title: "Purpose" }} />
      <Stack.Screen name="StepEight" component={StepEight} options={{ title: "Final Step" }} />
      <Stack.Screen name="Survey" component={SurveyWizard} options={{ title: "Survey" }} />
    </Stack.Navigator>
  );
};

export default OnBoardingNavigator;
