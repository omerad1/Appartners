import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SwipeScreen from "../screens/SwipeScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import LikesScreen from "../screens/LikesScreen";
import ChatScreen from "../screens/ChatScreen";
import ScreenWrapper from "../components/ScreenWrapper";
import { appartmentView } from "../data/mockData/appartmentView";

import ApartmentScreen from "../screens/apartmentScreens/ApartmentScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  console.log(appartmentView);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        sceneStyle: {
          backgroundColor: "transparent",
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(91, 89, 85, 0.88)", // Gradient-like dark purple
          borderTopWidth: 0,
          height: 60, // Increased height for better spacing
        },
        tabBarActiveTintColor: "rgb(255, 255, 255))", // Neon yellow for active
        tabBarInactiveTintColor: "#BDAEB4", // Soft purple-gray for inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Configure icons for each route
          switch (route.name) {
            case "Swipe":
              iconName = "swap-horizontal-outline"; // Swiping gesture
              break;
            case "ListApartment":
              iconName = "home-outline"; // House icon for apartments
              break;
            case "Likes":
              iconName = "heart-outline"; // Heart for likes
              break;
            case "Chat":
              iconName = "chatbubble-ellipses-outline"; // Chat bubble
              break;
            case "Profile":
              iconName = "person-circle-outline"; // User profile
              break;
            default:
              iconName = "ellipse"; // Default icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Swipe"
        component={SwipeScreen.bind(this, appartmentView)}
        options={{ title: "Swipe" }}
      />
      <Tab.Screen
        name="ListApartment"
        component={ApartmentScreen}
        options={{ title: "Listings" }}
      />
      <Tab.Screen
        name="Likes"
        component={LikesScreen}
        options={{ title: "Likes" }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat" }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
