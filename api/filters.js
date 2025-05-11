import endpoints from "./endpoints";
import api from "./client"

export const getUserFilters = async () => {
    try {
      const res = await api.get(endpoints.filters);
      console.log("🏠 Fetched filters", res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message;
      console.error("❌ Failed to fetch filters", message);
      throw new Error(message);
    }
};

export const postUserFilters = async (filtersData) => {
    try {
        // Extract city ID if city is an object
        const cityValue = filtersData.city ? 
            (typeof filtersData.city === 'object' ? filtersData.city.id : filtersData.city) : 
            null;
            
        // Convert from app format to API format if needed
        const apiFormatData = {
            move_in_date: filtersData.moveInDate,
            price_range: {
                min_price: filtersData.priceRange?.min || null,
                max_price: filtersData.priceRange?.max || null
            },
            number_of_roommates: filtersData.number_of_roommates || [],
            city: cityValue, // Send only the ID to the backend
            features: filtersData.features || [],
            max_floor: filtersData.max_floor || null,
            area: filtersData.area || null
        };
        
        // Make the POST request to save filters
        const res = await api.post(endpoints.filters, apiFormatData);
        console.log("🏠 Saved user filters", res.data);
        return res.data;
    }
    catch (err) {
        const message = err.response?.data?.detail || err.message;
        console.error("❌ Failed to save user filters", message);
        throw new Error(message);
    }
};
