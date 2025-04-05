import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';

const StepSix = () => {
  const dispatch = useDispatch();
  const { password: savedPassword } = useSelector(state => state.onboarding);

  const [password, setPassword] = useState(savedPassword || "");
  const [confirmPassword, setConfirmPassword] = useState(savedPassword || "");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value === confirmPassword) {
      dispatch(updateOnboardingData({ password: value }));
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value === password) {
      dispatch(updateOnboardingData({ password: value }));
    }
  };

  const handleNext = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  return (
    <OnBoardingLayout
      title={"Set Your Password"}
      next={true}
      direction={"StepSeven"}
      onPress={handleNext}
    >
      <View style={styles.inputContainer}>
        {/* Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={handlePasswordChange}
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

        {/* Confirm Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirm Password"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Icon
              name={confirmPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
      </View>
    </OnBoardingLayout>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 15,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
    color: "#000",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 15,
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
});

export default StepSix;
