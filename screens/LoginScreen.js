import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Title from "../components/Title";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/icons/logo.png")} style={styles.logo} />

      {/* Welcome Text */}
      <Title>Welcome Back!</Title>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus={true}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon
            name={passwordVisible ? "eye" : "eye-off"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <Text style={styles.orText}>or</Text>

      {/* Continue with Google */}
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require("../assets/icons/google.png")} // Replace with your Google icon's path
          style={styles.socialIcon}
        />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Continue with Facebook */}
      <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
        <Ionicons
          name="logo-facebook"
          size={22}
          color="white"
          style={styles.socialIcon}
        />
        <Text style={[styles.socialButtonText, { color: "white" }]}>
          Continue with Facebook
        </Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={styles.signUpText}>
        Don’t have an account? <Text style={styles.signUpLink}>Sign up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 200,
    height: 121,
    marginBottom: 10,
    resizeMode: "stretch",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 15,
  },
  orText: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
  },
  socialButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  facebookButton: {
    backgroundColor: "#0866ff",
    color: "white",
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  socialButtonText: {
    color: "#333",
    fontSize: 16,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  signUpLink: {
    color: "#000",
    fontWeight: "bold",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  passwordInput: {
    paddingRight: 45, // Add padding for the eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
});

export default LoginScreen;
