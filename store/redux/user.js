import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  preferences: null,
  isLoading: false,
  error: null,
  isProfileUpdating: false,
  profileUpdateError: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.preferences = null;
    },
    setPreferences: (state, action) => {
      state.preferences = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload
      };
    },
    setProfileUpdating: (state, action) => {
      state.isProfileUpdating = action.payload;
    },
    setProfileUpdateError: (state, action) => {
      state.profileUpdateError = action.payload;
    }
  },
});

// Export the actions
export const { 
  login, 
  logout, 
  setPreferences, 
  updatePreferences, 
  setLoading, 
  setError,
  updateUserProfile,
  setProfileUpdating,
  setProfileUpdateError
} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
