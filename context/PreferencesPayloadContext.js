import React, { createContext, useState, useContext, useEffect } from 'react';
import { getPreferencesPayload } from '../api/appDataPayload';

// Create the context
const PreferencesPayloadContext = createContext();

/**
 * Provider component that wraps the app and makes preferences payload data
 * available to any child component that calls usePreferencesPayload().
 */
export const PreferencesPayloadProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch preferences payload data on component mount
  useEffect(() => {
    const fetchPayload = async () => {
      try {
        setIsLoading(true);
        const data = await getPreferencesPayload();
        
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
  
  // The value that will be provided to consumers of this context
  const value = {
    cities,
    tags,
    isLoading,
    error,
    // Add a refresh method in case we need to reload the data
    refreshPayload: async () => {
      try {
        setIsLoading(true);
        const data = await getPreferencesPayload();
        setCities(data.cities || []);
        setTags(data.tags || []);
        setError(null);
        return data;
      } catch (err) {
        setError(err.message || 'Failed to refresh preferences data');
        throw err;
      } finally {
        setIsLoading(false);
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
