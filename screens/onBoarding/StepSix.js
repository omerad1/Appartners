import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Snackbar } from "react-native-paper";

// Yup schema for password validation
const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], "Passwords must match")
    .required("Please confirm your password"),
});

const StepSix = () => {
  const dispatch = useDispatch();
  const { password: savedPassword } = useSelector(state => state.onboarding);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  // Password validation states
  const [currentPassword, setCurrentPassword] = useState(savedPassword || "");
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
  });

  // Check password requirements on every change
  useEffect(() => {
    setPasswordRequirements({
      minLength: currentPassword.length >= 8,
      hasLowercase: /[a-z]/.test(currentPassword),
      hasUppercase: /[A-Z]/.test(currentPassword),
      hasNumber: /[0-9]/.test(currentPassword),
    });
  }, [currentPassword]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: savedPassword || "",
      confirmPassword: savedPassword || "",
    },
  });

  const onSubmit = (data) => {
    dispatch(updateOnboardingData({ password: data.password }));
    return true;
  };

  const submitAndValidate = () =>
    new Promise((resolve) => {
      handleSubmit((data) => {
        const result = onSubmit(data);
        resolve(result);
      })();
    });

  // Render password requirement indicator
  const renderRequirement = (label, isFulfilled) => (
    <View style={styles.requirementRow} key={label}>
      <Icon 
        name={isFulfilled ? "checkmark-circle" : "ellipse-outline"} 
        size={16} 
        color={isFulfilled ? "#4CAF50" : "#9E9E9E"} 
      />
      <Text style={[
        styles.requirementText, 
        { color: isFulfilled ? "#4CAF50" : "#9E9E9E" }
      ]}>
        {label}
      </Text>
    </View>
  );

  return (
    <>
      <OnBoardingLayout
        title={"Set Your Password"}
        next={true}
        direction={"StepSeven"}
        onPress={submitAndValidate}
      >
        <View style={styles.inputContainer}>
          {/* Password Field */}
          <View style={styles.passwordContainer}>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setCurrentPassword(text);
                  }}
                />
              )}
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

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            {renderRequirement("At least 8 characters", passwordRequirements.minLength)}
            {renderRequirement("At least 1 lowercase letter (a-z)", passwordRequirements.hasLowercase)}
            {renderRequirement("At least 1 uppercase letter (A-Z)", passwordRequirements.hasUppercase)}
            {renderRequirement("At least 1 number (0-9)", passwordRequirements.hasNumber)}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.passwordContainer}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                  placeholder="Confirm Password"
                  secureTextEntry={!confirmPasswordVisible}
                  value={value}
                  onChangeText={onChange}
                />
              )}
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
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            )}
          </View>
        </View>
      </OnBoardingLayout>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
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
    marginBottom: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "red",
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 5,
  },
  requirementsContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default StepSix;
