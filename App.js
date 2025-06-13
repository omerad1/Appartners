import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,

} from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import store from "./store/redux/store";
import TabNavigator from "./navigation/TabNavigator";
import LoginScreen from "./screens/LoginScreen";
import OnBoardingNavigator from "./navigation/OnBoardingNavigator";
import CreateApartmentNavigator from "./navigation/CreateApartmentNavigator";
import FilterScreenPage from "./screens/FilterScreenPage";
import ForgotPasswordNavigation from "./navigation/ForgotPasswordNavigation";
import { PreferencesPayloadProvider } from "./context/PreferencesPayloadContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppartnersLoader from "./components/general/ApartnersLoader";

const Stack = createStackNavigator();

// Main navigation component that handles auth state
function MainNavigator() {
  // Get auth state from context
  const { isLoading, isAuthenticated } = useAuth();
  const [shouldShowLoader, setShouldShowLoader] = useState(true);
  const [hasMinimumTimePassed, setHasMinimumTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMinimumTimePassed(true);
    }, 4000); // Minimum 4 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && hasMinimumTimePassed) {
      setShouldShowLoader(false);
    }
  }, [isLoading, hasMinimumTimePassed]);

  if (shouldShowLoader || isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <AppartnersLoader />
      </View>
    );
  }
  

  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
          }}
          initialRouteName={isAuthenticated ? "MainApp" : "Login"}
        >
          {!isAuthenticated ? (
            // Auth screens
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="OnBoarding" component={OnBoardingNavigator} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordNavigation} />
            </>
          ) : (
            // App screens
            <>
              <Stack.Screen name="MainApp" component={TabNavigator} />
              <Stack.Screen
                name="CreateApartment"
                component={CreateApartmentNavigator}
              />
              <Stack.Screen
                name="Filter"
                component={FilterScreenPage}
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationEnabled: true,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
}

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
    <PreferencesPayloadProvider>
      <ReduxProvider store={store}>
        <PaperProvider>
          <AuthProvider>
            <MainNavigator />
          </AuthProvider>
        </PaperProvider>
      </ReduxProvider>
    </PreferencesPayloadProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    opacity: 0.3,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "comfortaaMedium",
  },
});
