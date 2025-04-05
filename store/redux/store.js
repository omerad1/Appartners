import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboardingSlice';

const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
});

export default store;