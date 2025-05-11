import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import AddApartmentScreen from "../screens/apartmentScreens/addApartment/AddApartmentScreen";
import PropertyTagsScreen from "../screens/apartmentScreens/addApartment/PropertyTagsScreen";
import PhotosScreen from "../screens/apartmentScreens/addApartment/PhotosScreen";

const stack = createStackNavigator();

const CreateApartmentNavigator = () => {
  return (
    <stack.Navigator
      initialRouteName="AddApartmentScreen"
      screenOptions={{
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
        animationEnabled: true,
        gestureEnabled: false,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 250 } },
          close: { animation: 'timing', config: { duration: 250 } },
        },

      }}
    >
      <stack.Screen
        name="AddApartmentScreen"
        component={AddApartmentScreen}
        options={{ title: "Apt Details" }}
      />
      <stack.Screen
        name="PropertyTagsScreen"
        component={PropertyTagsScreen}
        options={{ title: "Property Tags" }}
      />
      <stack.Screen
        name="PhotosScreen"
        component={PhotosScreen}
        options={{ title: "Photos" }}
      />
    </stack.Navigator>
  );
};

export default CreateApartmentNavigator;
