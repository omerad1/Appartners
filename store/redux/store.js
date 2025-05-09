import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboardingSlice';
import userReducer from './user';

const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    user: userReducer,
  },
});

export default store;