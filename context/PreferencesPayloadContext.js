import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPreferencesPayload, getQuestions } from '../api/appDataPayload';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const PreferencesPayloadContext = createContext();
const retryWithDelay = async (fn, retries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Retry ${i + 1}/${retries} failed:`, err.message);
      await new Promise((res) => setTimeout(res, delay * (i + 1)));
    }
  }
  throw lastError;
};

/**
 * Provider component that wraps the app and makes preferences payload data
 * available to any child component that calls usePreferencesPayload().
 */
export const PreferencesPayloadProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [tags, setTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch preferences payload data on component mount
  useEffect(() => {
    const fetchPayload = async () => {
      try {
        setIsLoading(true);
        const data = await retryWithDelay(() => getPreferencesPayload());
        
        // Assuming the API returns an object with cities and tags arrays
        setCities(data.cities || []);
        setTags(data.apartment_features || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load preferences payload:', err);
        setError(err.message || 'Failed to load preferences data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayload();
  }, []);

  // Fetch questions data and store locally
  useEffect(() => {
    const fetchAndStoreQuestions = async () => {
      try {
        // First try to get questions from AsyncStorage
        const storedQuestions = await AsyncStorage.getItem('appQuestions');
        
        if (storedQuestions) {
          // If questions exist in storage, use them
          setQuestions(JSON.parse(storedQuestions));
          console.log('Loaded questions from local storage');
        } else {
          // If not in storage, fetch from API
          const questionsData = await retryWithDelay(() => getQuestions());
          setQuestions(questionsData);
          
          // Store in AsyncStorage for future use
          await AsyncStorage.setItem('appQuestions', JSON.stringify(questionsData));
          console.log('Fetched and stored questions in local storage');
        }
      } catch (err) {
        console.error('Failed to load or store questions:', err);
        // Try to load from AsyncStorage as fallback if API fails
        try {
          const fallbackQuestions = await AsyncStorage.getItem('appQuestions');
          if (fallbackQuestions) {
            setQuestions(JSON.parse(fallbackQuestions));
            console.log('Loaded questions from local storage after API failure');
          }
        } catch (storageErr) {
          console.error('Failed to load questions from storage:', storageErr);
        }
      }
    };
    
    fetchAndStoreQuestions();
  }, []);
  
  // The value that will be provided to consumers of this context
  const value = {
    cities,
    tags,
    questions,
    isLoading,
    error,
    // Add a refresh method in case we need to reload the data
    refreshPayload: async () => {
      try {
        setIsLoading(true);
        const data = await getPreferencesPayload();
        setCities(data.cities || []);
        setTags(data.apartment_features || []);
        setError(null);
        return data;
      } catch (err) {
        setError(err.message || 'Failed to refresh preferences data');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    // Method to force refresh questions from API
    refreshQuestions: async () => {
      try {
        const questionsData = await getQuestions();
        setQuestions(questionsData);
        
        // Update in AsyncStorage
        await AsyncStorage.setItem('appQuestions', JSON.stringify(questionsData));
        console.log('Manually refreshed questions and updated local storage');
        return questionsData;
      } catch (err) {
        console.error('Failed to refresh questions:', err);
        throw err;
      }
    }
  };
  
  return (
    <PreferencesPayloadContext.Provider value={value}>
      {children}
    </PreferencesPayloadContext.Provider>
  );
};

/**
 * Custom hook to use the preferences payload context
 */
export const usePreferencesPayload = () => {
  const context = useContext(PreferencesPayloadContext);
  if (context === undefined) {
    throw new Error('usePreferencesPayload must be used within a PreferencesPayloadProvider');
  }
  return context;
};
