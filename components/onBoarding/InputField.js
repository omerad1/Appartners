import { StyleSheet, View, TextInput } from "react-native";
import React, { useState } from "react";

const InputField = ({ placeholder, type, onChange }) => {
  const [enteredValue, setEnteredValue] = useState("");

  const handleChange = (text) => {
    setEnteredValue(text);
    onChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        inputMode={type}
        value={enteredValue}
        onChangeText={handleChange}
        placeholderTextColor={"rgba(0, 0, 0, 0.48)"}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    boxShadow: "7px 7px 5px 2px rgba(0, 0, 0, 0.1)",
    // // Shadow for iOS
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,

    // // Elevation for Android
    // elevation: 2,
  },
});
