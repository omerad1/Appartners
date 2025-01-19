import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddApartmentScreen from "../screens/apartmentScreens/addApartment/AddApartmentScreen";
import PropertyTagsScreen from "../screens/apartmentScreens/addApartment/PropertyTagsScreen";
import PhotosScreen from "../screens/apartmentScreens/addApartment/PhotosScreen";

const stack = createStackNavigator();

const CreateApartmentNavigator = () => {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: true,
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
      ></stack.Screen>
      <stack.Screen
        name="PhotosScreen"
        component={PhotosScreen}
        options={{ title: "Photoes" }}
      ></stack.Screen>
    </stack.Navigator>
  );
};

export default CreateApartmentNavigator;
