import React, { useState } from "react";
import { StyleSheet, Text, Pressable, ActivityIndicator, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StepButton = ({ text, next, direction, onPress }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = async () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    
    setIsLoading(true);
    setIsPressed(true);
    
    try {
      if (onPress) {
        const result = await onPress();
        console.log("Button pressed, onPress result:", result);
        
        if (result === false) {
          // Only prevent navigation if onPress explicitly returns false
          setIsLoading(false);
          setTimeout(() => setIsPressed(false), 300); // Reset pressed state after a short delay
          return;
        }
      }

      if (direction) {
        // Check if we're in the CreateApartmentNavigator
        const routeName = navigation.getState().routes[navigation.getState().index].name;
        if (routeName === 'CreateApartment' || routeName === 'AddApartmentScreen' || 
            routeName === 'PropertyTagsScreen' || routeName === 'PhotosScreen') {
          // We're in the CreateApartmentNavigator, navigate directly
          navigation.navigate(direction);
        } else {
          // We're in the OnBoarding flow
          navigation.navigate("OnBoarding", { screen: direction });
        }
      }
    } catch (error) {
      console.error("Error in button press handler:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsPressed(false), 300); // Reset pressed state after a short delay
    }
  };
  
  const buttonStyle = next ? styles.nextButton : styles.prevButton;
  const pressedStyle = isPressed ? styles.buttonPressed : {};
  const disabledStyle = isLoading ? styles.buttonDisabled : {};

  return (
    <Pressable 
      style={[
        styles.buttonBase, 
        buttonStyle, 
        pressedStyle,
        disabledStyle
      ]} 
      onPress={handlePress}
      disabled={isLoading}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={[styles.buttonText, styles.loadingText]}>
            {next ? "Loading..." : ""}
          </Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{next ? "Next" : text || "Skip"}</Text>
      )}
    </Pressable>
  );
};

export default StepButton;

const styles = StyleSheet.create({
  buttonBase: {
    padding: 12,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    minHeight: 48,
  },
  nextButton: {
    backgroundColor: "black",
  },
  prevButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
  }
});
