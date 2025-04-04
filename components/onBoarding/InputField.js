import { StyleSheet, View, TextInput, Text } from "react-native";
import React, { useState, useEffect } from "react";

const InputField = ({
  placeholder,
  type,
  onChange,
  label = false,
  value, // optional
  error = null, // optional
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  // Keep internal state in sync with controlled value (if provided)
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (text) => {
    setInternalValue(text);
    onChange?.(text); // call onChange if provided
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? { borderColor: "red" } : null]}
        placeholder={placeholder}
        inputMode={type}
        value={internalValue}
        onChangeText={handleChange}
        placeholderTextColor={"rgba(0, 0, 0, 0.48)"}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
    paddingLeft: 10,
    fontSize: 20,
    color: "#333",
    fontFamily: "comfortaaSemiBold",
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
    // Shadow for iOS
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,

    // // Elevation for Android
    // elevation: 2,
  },
});
