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
      initialRouteName="AddApartmentScreen"
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        presentation: 'card',
      }}
    >
      <stack.Screen
        name="AddApartmentScreen"
        component={AddApartmentScreen}
        options={{ 
          title: "Apt Details",
          headerLeft: (props) => props.canGoBack ? props.defaultHandler : null
        }}
      />
      <stack.Screen
        name="PropertyTagsScreen"
        component={PropertyTagsScreen}
        options={{ 
          title: "Property Tags",
          headerLeft: (props) => props.canGoBack ? props.defaultHandler : null
        }}
      />
      <stack.Screen
        name="PhotosScreen"
        component={PhotosScreen}
        options={{ 
          title: "Photos",
          headerLeft: (props) => props.canGoBack ? props.defaultHandler : null
        }}
      />
    </stack.Navigator>
  );
};

export default CreateApartmentNavigator;
