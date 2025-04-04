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
  photos: [],
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
