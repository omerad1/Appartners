import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import InputField from "../../components/onBoarding/InputField";
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/redux/slices/onboardingSlice';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Snackbar } from "react-native-paper";

// Yup schema for first name and last name validation
const schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z\u0590-\u05FF\s]+$/, "First name should contain only letters")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z\u0590-\u05FF\s]+$/, "Last name should contain only letters")
    .required("Last name is required"),
});

const StepTwo = () => {
  const dispatch = useDispatch();
  const { firstName, lastName } = useSelector(state => state.onboarding);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
    },
  });

  const onSubmit = (data) => {
    const { firstName, lastName } = data;
    // Save to Redux store
    dispatch(updateOnboardingData({ firstName, lastName }));
    return true;
  };

  const submitAndValidate = () =>
    new Promise((resolve) => {
      // This will run if validation passes
      const onValid = (data) => {
        const result = onSubmit(data);
        resolve(result);
      };
      
      // This will run if validation fails
      const onInvalid = (errors) => {
        console.log('Validation errors:', errors);
        // Immediately resolve with false to prevent the loader
        resolve(false);
      };
      
      // Pass both callbacks to handleSubmit
      handleSubmit(onValid, onInvalid)();
    });

  return (
    <>
      <OnBoardingLayout
        direction="StepThree"
        next={true}
        title="What Is Your Name?"
        onPress={submitAndValidate}
      >
        <Controller
          name="firstName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              placeholder="First Name *"
              type="text"
              onChange={(text) => {
                onChange(text);
              }}
              value={value}
              error={error?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              placeholder="Last Name *"
              type="text"
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

export default StepTwo;

const styles = StyleSheet.create({});
