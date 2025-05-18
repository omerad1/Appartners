import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTokens, clearTokens, saveTokens } from '../api/client';
import api from '../api/client';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/redux/user';
import endpoints from '../api/endpoints';
import { fetchUserData } from '../api/user';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  // Function to verify tokens and set authentication state
  const verifyTokens = async () => {
    try {
      setIsLoading(true);
      
      // Get tokens from secure storage
      const { accessToken, refreshToken } = await getTokens();
      
      // If no tokens, user is not authenticated
      if (!accessToken && !refreshToken) {

        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // If we have a refresh token but no access token or expired access token
      if (refreshToken) {
        try {

          // Call the refresh endpoint directly
          const refreshResponse = await axios.post(`${api.defaults.baseURL}${endpoints.refreshToken}`, {
            refresh_token: refreshToken
          });
          
          // Extract tokens from response
          const { UserAuth, RefreshToken } = refreshResponse.data;
          
          // Save the new tokens
          await saveTokens(UserAuth, RefreshToken);
          
          // Now fetch user data with the new access token (force refresh from server)
          const userData = await fetchUserData(true);
          
          if (userData) {
            dispatch(login(userData));
            setIsAuthenticated(true);
          }
        } catch (refreshError) {

          await clearTokens();
          dispatch(logout());
          setIsAuthenticated(false);
        }
      } else if (accessToken) {
        // We have an access token, try to use it
        try {
          // Fetch user data with the access token (force refresh from server)
          const userData = await fetchUserData(true);
          
          if (userData) {
            dispatch(login(userData));
            setIsAuthenticated(true);
          }
        } catch (error) {

          await clearTokens();
          dispatch(logout());
          setIsAuthenticated(false);
        }
      }
    } catch (error) {

      await clearTokens();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    verifyTokens();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    await clearTokens();
    dispatch(logout());
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Context value
  const value = {
    isLoading,
    isAuthenticated,
    verifyTokens,
    logout: handleLogout,
    loginSuccess: handleLoginSuccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
