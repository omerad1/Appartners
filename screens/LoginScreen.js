import React from "react";
import KeyboardAwareWrapper from "../components/layouts/KeyboardAwareWrapper";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Title from "../components/general/Title";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { login as apiLogin } from "../api/auth";
import InputField from "../components/onBoarding/InputField";
import BackgroundImage from "../components/layouts/BackgroundImage";
import { useDispatch } from "react-redux";
import { login } from "../store/redux/user";
import { useAuth } from "../context/AuthContext";
import { fetchUserData } from "../api/user";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loginSuccess } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Call the API login function
      const response = await apiLogin(email, password);
      console.log("Login successful:", response);

      if (response && response.UserAuth && response.RefreshToken) {
        // Fetch user data after successful login

        try {
          const userData = await fetchUserData(true); // Force refresh from server
          console.log("userDATA: ", userData)
          if (userData) {
            // Dispatch user data to Redux store
            dispatch(login(userData));
            console.log("User data fetched and stored in Redux");
          }
        } catch (userDataError) {
          console.error("Failed to fetch user data:", userDataError);
          // Continue with login even if user data fetch fails
        }
        // Set authentication state to true
        loginSuccess();

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
    <BackgroundImage>
      <KeyboardAwareWrapper scrollEnabled={false}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require("../assets/icons/logo.png")}
            style={styles.logo}
          />

          {/* Welcome Text */}
          <Title>Welcome Back!</Title>

          {/* Email Input */}
          <InputField
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus={true}
            value={email}
            onChange={setEmail}
            error={errors.email}
          />

          {/* Password Input */}
          <InputField
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChange={setPassword}
            error={errors.password}
          />

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
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
              source={require("../assets/icons/google.png")}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Continue with Facebook */}
          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
          >
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
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("OnBoarding", { screen: "StepOne" })
              }
            >
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareWrapper>
    </BackgroundImage>
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
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#555",
  },
  signUpLink: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default LoginScreen;
