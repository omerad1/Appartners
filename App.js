import React from "react";
import { StyleSheet, View, ImageBackground, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from 'react-redux';
import store from './store/redux/store';
import TabNavigator from "./navigation/TabNavigator";
import LoginScreen from "./screens/LoginScreen";
import OnBoardingNavigator from "./navigation/OnBoardingNavigator";
import CreateApartmentNavigator from "./navigation/CreateApartmentNavigator";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    comfortaa: require("./assets/fonts/Comfortaa-Regular.ttf"),
    comfortaaBold: require("./assets/fonts/Comfortaa-Bold.ttf"),
    comfortaaLight: require("./assets/fonts/Comfortaa-Light.ttf"),
    comfortaaMedium: require("./assets/fonts/Comfortaa-Medium.ttf"),
    comfortaaSemiBold: require("./assets/fonts/Comfortaa-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={styles.loadingScreen} />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <ImageBackground
          source={require("./assets/background.jpg")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0)",
              "rgba(251, 251, 251, 0.73)",
              "rgba(255, 255, 255, 0.6)",
              "rgba(255, 255, 255, 0.08)",
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="OnBoarding" component={OnBoardingNavigator} />
              <Stack.Screen name="MainApp" component={TabNavigator} />
              <Stack.Screen
                name="CreateApartment"
                component={CreateApartmentNavigator}
              />
            </Stack.Navigator>
          </LinearGradient>
        </ImageBackground>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
