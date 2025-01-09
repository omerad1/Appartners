import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

const TextArea = ({ placeholder, value, onChange }) => {
  const [isRTL, setIsRTL] = useState(false);

  const handleTextChange = (text) => {
    // Detect if the text contains Hebrew characters
    const hebrewRegex = /[\u0590-\u05FF]/;
    setIsRTL(hebrewRegex.test(text));

    // Trigger the onChange callback
    onChange(text);
  };

  return (
    <TextInput
      style={[
        styles.textArea,
        {
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      multiline={true}
      numberOfLines={7}
      textAlignVertical="top"
      value={value}
      onChangeText={handleTextChange}
      scrollEnabled={true}
    />
  );
};

export default TextArea;

const styles = StyleSheet.create({
  textArea: {
    height: 140,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#fff", // White background
    color: "#000", // Black text color
    textAlignVertical: "top",
  },
});
