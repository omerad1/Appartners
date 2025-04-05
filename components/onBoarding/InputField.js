import { StyleSheet, View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const InputField = ({
  placeholder,
  type,
  onChange,
  label = false,
  value,
  error = null,
  secureTextEntry,
  style,
  inputStyle,
  autoCapitalize = "sentences",
  keyboardType,
  autoFocus,
  rightIcon,
  onRightIconPress,
}) => {
  const [internalValue, setInternalValue] = useState(value || "");
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(!secureTextEntry);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (text) => {
    setInternalValue(text);
    onChange?.(text);
  };

  const toggleSecureEntry = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? { borderColor: "red" } : null, inputStyle]}
          placeholder={placeholder}
          inputMode={type}
          value={internalValue}
          onChangeText={handleChange}
          placeholderTextColor={"rgba(0, 0, 0, 0.48)"}
          secureTextEntry={secureTextEntry && !isSecureTextVisible}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.iconButton} onPress={toggleSecureEntry}>
            <Icon
              name={isSecureTextVisible ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity style={styles.iconButton} onPress={onRightIconPress}>
            <Icon name={rightIcon} size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  label: {
    marginBottom: 5,
    paddingLeft: 10,
    fontSize: 20,
    color: "#333",
    fontFamily: "comfortaaSemiBold",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 45,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
  iconButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 10,
  },
});
