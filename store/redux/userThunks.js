import { getUserFilters, postUserFilters } from '../../api/filters';
import { getPreferencesPayload } from '../../api/appDataPayload';
import { setLoading, setError, setPreferences, updatePreferences, updateUserProfile, setProfileUpdating, setProfileUpdateError } from './user';
import { saveUserDataToStorage, updateUserProfile as apiUpdateUserProfile, fetchUserData } from '../../api/user';

// Thunk action to fetch user preferences
export const fetchUserPreferences = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Fetch filters from the server
    const serverFilters = await getUserFilters();
    
    // Check if serverFilters is null or undefined
    if (!serverFilters) {
      dispatch(setPreferences({
        moveInDate: null,
        priceRange: { min: 0, max: 10000 },
        number_of_roommates: [],
        city: null,
        features: [],
        max_floor: null,
        area: null
      }));
      dispatch(setLoading(false));
      return {};
    }
    
    // If we have a city ID, try to get the city object with name
    let cityData = serverFilters.city;
    
    if (serverFilters.city) {
      try {
        // Get the city data from the preferences payload
        const payloadData = await getPreferencesPayload();
        if (payloadData.cities && Array.isArray(payloadData.cities)) {
          // Find the city by ID
          const cityObject = payloadData.cities.find(city => city.id === serverFilters.city);
          if (cityObject) {
            // If found, use the city object with both ID and name
            cityData = cityObject;
          }
        }
      } catch (err) {
        console.warn('Could not fetch city data:', err);
        // If there's an error, we'll just use the city ID
      }
    }
    
    // Map server filter format to application filter format
    const mappedFilters = {
      moveInDate: serverFilters.move_in_date,
      priceRange: {
        min: serverFilters.price_range?.min_price || 0, // Default values
        max: serverFilters.price_range?.max_price || 10000
      },
      number_of_roommates: serverFilters.number_of_roommates || [],
      city: cityData, // This will be either the city object or just the ID
      features: serverFilters.features || [],
      max_floor: serverFilters.max_floor,
      area: serverFilters.area
    };
    
    // Store the mapped preferences in Redux
    dispatch(setPreferences(mappedFilters));
    dispatch(setLoading(false));
    
    return mappedFilters;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    dispatch(setError(error.message || 'Failed to fetch preferences'));
    dispatch(setLoading(false));
    throw error;
  }
};

// Thunk action to update user preferences
export const saveUserPreferences = (newPreferences) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    // Get current preferences from Redux store
    const { preferences } = getState().user;
    
    // Merge with new preferences
    const mergedPreferences = { ...preferences, ...newPreferences };
    
    // Save preferences to the server
    await postUserFilters(mergedPreferences);
    
    // Update Redux store
    dispatch(updatePreferences(newPreferences));
    dispatch(setLoading(false));
    
    return mergedPreferences;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    dispatch(setError(error.message || 'Failed to save preferences'));
    dispatch(setLoading(false));
    throw error;
  }
};


//  get user data from the storage or server

export const getUserData = () => async () => {

}
// Thunk action to save user data to AsyncStorage and Redux store
export const saveUserData = (userData) => async (dispatch) => {
  try {
    // Save user data to AsyncStorage
    await saveUserDataToStorage(userData);
    
    // Update Redux store
    dispatch(updateUserProfile(userData));
    
    return userData;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

// Thunk action to load user data
export const loadUserData = (forceRefresh = false) => async (dispatch) => {
  try {
    console.log('Loading user data...');
    
    // Use the fetchUserData function which handles both local and server data
    const userData = await fetchUserData(forceRefresh);
    
    if (userData) {
      // Dispatch action to update Redux store
      dispatch(updateUserProfile(userData));
      console.log('User data loaded into Redux store');
      return userData;
    } else {
      console.warn('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
};

// Thunk action to update user profile
export const updateUserProfileData = (updatedData) => async (dispatch, getState) => {
  try {
    dispatch(setProfileUpdating(true));
    dispatch(setProfileUpdateError(null));
    
    // Get current user data from Redux store
    const { currentUser } = getState().user;
    
    if (!currentUser) {
      throw new Error('No user data found');
    }
    
    // Merge with updated data
    const mergedUserData = { ...currentUser, ...updatedData };
    
    // First try to update on the server
    const serverResponse = await apiUpdateUserProfile(mergedUserData);
    
    // If server update is successful, then save locally
    console.log('Server update successful:', serverResponse);
    await saveUserDataToStorage(mergedUserData);
    dispatch(updateUserProfile(updatedData));
    
    dispatch(setProfileUpdating(false));
    return mergedUserData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    dispatch(setProfileUpdateError(error.message || 'Failed to update profile'));
    dispatch(setProfileUpdating(false));
    throw error;
  }
};
