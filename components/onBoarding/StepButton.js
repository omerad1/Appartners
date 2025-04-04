import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StepButton = ({ text, next, direction, onPress }) => {
  const navigation = useNavigation();

  const handlePress = async () => {
    if (onPress) {
      const result = await onPress();
      console.log("Button pressed, onPress result:", result);
      if (!result) return; // Prevent navigation if onPress returns false
    }

    if (direction) {
      navigation.navigate("OnBoarding", { screen: direction });
    }
  };
  const buttonStyle = next ? styles.nextButton : styles.prevButton;

  return (
    <Pressable style={[styles.buttonBase, buttonStyle]} onPress={handlePress}>
      <Text style={styles.buttonText}>{next ? "Next" : text || "Skip"}</Text>
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
});
