import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const NumberSlider = ({
  min = 0,
  max = 10,
  step = 1,
  initialValue = 0,
  onValueChange,
}) => {
  const [value, setValue] = useState(initialValue);

  const increaseValue = () => {
    if (value < max) {
      const newValue = value + step;
      setValue(newValue);
      onValueChange && onValueChange(newValue);
    }
  };

  const decreaseValue = () => {
    if (value > min) {
      const newValue = value - step;
      setValue(newValue);
      onValueChange && onValueChange(newValue);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={increaseValue} style={styles.button}>
        <MaterialIcons name="keyboard-arrow-up" size={24} color="gray" />
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity onPress={decreaseValue} style={styles.button}>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default NumberSlider;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 35, // Slightly wider for better spacing
    backgroundColor: "#fff", // White background
    borderRadius: 20, // Rounded edges for floating effect
    shadowColor: "#000", // Shadow for floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Elevation for Android shadow
  },
  value: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
});
