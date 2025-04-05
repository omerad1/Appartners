import React from "react";
import { StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../../components/onBoarding/InputField";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { Snackbar } from "react-native-paper";
import { validateUnique } from "../../api/registration";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';

// Yup schema for required email & phone
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email, should have @ / .com")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{9,10}$/, "Invalid phone number, should be 10 digits")
    .required("Phone number is required"),
});

const StepOne = () => {
  const dispatch = useDispatch();
  const { email, phoneNumber } = useSelector(state => state.onboarding);
  
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: email || '',
      phoneNumber: phoneNumber || '',
    }
  });
  
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onSubmit = async (data) => {
    const { email, phoneNumber } = data;
    console.log("Form data submitted:", data);

    try {
      await validateUnique(email, phoneNumber);
      console.log("✅ Email & phone are unique");
      // Save to Redux store
      dispatch(updateOnboardingData({ email, phoneNumber }));
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.email ||
        err.response?.data?.phone ||
        "Invalid details.";
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
      return false;
    }
  };

  const submitAndValidate = () =>
    new Promise((resolve) => {
      handleSubmit(async (data) => {
        const result = await onSubmit(data);
        resolve(result);
      })();
    });

  return (
    <>
      <OnBoardingLayout
        direction="StepTwo"
        next={true}
        title={`Welcome!\nPlease Enter Your Details`}
        onPress={submitAndValidate}
      >
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              placeholder="Email"
              type="email"
              onChange={(text) => {
                onChange(text);
              }}
              value={value}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              placeholder="Phone Number"
              type="tel"
              onChange={(text) => {
                onChange(text);
              }}
              value={value}
              error={error?.message}
            />
          )}
        />
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

export default StepOne;
const styles = StyleSheet.create({});
