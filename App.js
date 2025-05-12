import React from "react";
import { StyleSheet, View, StatusBar, ImageBackground } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import store from './store/redux/store';
import TabNavigator from "./navigation/TabNavigator";
import LoginScreen from "./screens/LoginScreen";
import OnBoardingNavigator from "./navigation/OnBoardingNavigator";
import CreateApartmentNavigator from "./navigation/CreateApartmentNavigator";
import { PreferencesPayloadProvider } from "./context/PreferencesPayloadContext";

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
    <PreferencesPayloadProvider>
      <ReduxProvider store={store}>
        <PaperProvider>
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
                  //cardStyle: { backgroundColor: 'transparent' },
                  animationEnabled: true,
                }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="OnBoarding" component={OnBoardingNavigator} />
                <Stack.Screen name="MainApp" component={TabNavigator} />
                <Stack.Screen
                  name="CreateApartment"
                  component={CreateApartmentNavigator}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ImageBackground>
        </PaperProvider>
      </ReduxProvider>
    </PreferencesPayloadProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.3,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
