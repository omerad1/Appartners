import { getUserFilters, postUserFilters } from '../../api/filters';
import { setLoading, setError, setPreferences, updatePreferences } from './user';

// Thunk action to fetch user preferences
export const fetchUserPreferences = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Fetch filters from the server
    const serverFilters = await getUserFilters();
    
    // Map server filter format to application filter format
    const mappedFilters = {
      moveInDate: serverFilters.move_in_date,
      priceRange: {
        min: serverFilters.price_range?.min_price || 0,
        max: serverFilters.price_range?.max_price || 10000
      },
      number_of_roommates: serverFilters.number_of_roommates || [],
      city: serverFilters.city,
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
