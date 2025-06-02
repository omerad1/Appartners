import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTokens, clearTokens, saveTokens } from '../api/client';
import api from '../api/client';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/redux/user';
import endpoints from '../api/endpoints';
import { fetchUserData } from '../api/user';
import { initializeSocket, disconnectSocket } from '../api/socket';
import store from '../store/redux/store';

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
  
  // Initialize socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Get the current user from Redux store
      const currentUser = store.getState().user.currentUser;
      console.log("checking auth user: ", currentUser)
      
      if (currentUser && currentUser.id) {
        console.log('User is authenticated, initializing socket with user ID:', currentUser.id);
        initializeSocket(currentUser.id)
          .then(socket => {
            if (socket) {
              console.log('Socket initialized successfully');
            } else {
              console.error('Failed to initialize socket');
            }
          })
          .catch(error => {
            console.error('Error initializing socket:', error);
          });
      } else {
        console.error('User is authenticated but no user ID available');
      }
    }
  }, [isAuthenticated]);

  // Function to handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    // Disconnect socket when user logs out
    disconnectSocket();
    await clearTokens();
    dispatch(logout());
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  // Function to handle successful login
  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    // Initialize socket connection after successful login
    try {
      const currentUser = store.getState().user.currentUser;
      const socket = await initializeSocket(currentUser.id);
      if (socket) {
        console.log('Socket initialized after login');
      } else {
        console.error('Failed to initialize socket after login');
      }
    } catch (error) {
      console.error('Error initializing socket after login:', error);
    }
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
