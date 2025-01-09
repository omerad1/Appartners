import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { useState } from "react";

const InputField = ({ placeholder, type, onChange }) => {
  const [enteredValue, setEnteredValue] = useState("");
  return (
    <View>
      <TextInput
        placeholder={placeholder}
        keyboardType={type}
        value={enteredValue}
        onChange={(event) => {
          setEnteredValue(event.target.value);
          onChange(event.target.value);
        }}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({});
