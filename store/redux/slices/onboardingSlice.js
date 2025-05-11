import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  birthDate: "",
  location: "",
  aboutMe: "",
  preferences: {},
  photo: [],
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    updateOnboardingData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetOnboarding: () => initialState,
  },
});

export const { updateOnboardingData, resetOnboarding } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
