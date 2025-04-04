import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Title from "../components/Title";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { login } from "../api/auth";

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Handle login with the authAPI
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      console.log("Login successful:", response);

      // Navigate to the main app if login is successful
      if (response && response.UserAuth) {
        // You might want to store the token and user data in a state management solution
        // For now, we'll just navigate to the main app
        navigation.navigate("MainApp");
      }
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.error ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
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
      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? "Logging in..." : "Log in"}
        </Text>
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
      <Text style={styles.signUpText}>Don't have an account? </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("OnBoarding", { screen: "StepOne" })}
      >
        <Text style={styles.signUpLink}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
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
  loginButtonDisabled: {
    backgroundColor: "#666",
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
    right: 15,
    top: 15,
  },
});

export default LoginScreen;
