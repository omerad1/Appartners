

// Helper function to transform apartment data from API to component format
export const transformApartmentData = (apartment) => {
    if (!apartment) return null;
  
    // Create tags from features if available
    let tags = [];
    if (apartment.feature_details && Array.isArray(apartment.feature_details)) {
      // Extract feature names if they exist
      tags = apartment.feature_details
        .filter((feature) => feature && typeof feature === "object")
        .map((feature) => feature.name || feature.type || "Feature")
        .slice(0, 3); // Limit to 3 tags
    }
  
    // Construct a proper address string
    const address = apartment.street
      ? `${apartment.street}, ${apartment.area || ""}`
      : apartment.area || "Address not available";
  
    return {
      id: apartment.id,
      image_url:
        apartment.photo_urls && apartment.photo_urls.length > 0
          ? apartment.photo_urls[0]
          : null,
      images: apartment.photo_urls || [],
      address: address,
      tags: tags,
      price_per_month: parseFloat(apartment.total_price) || 0,
      rooms: apartment.number_of_rooms || 0,
      area_sqm: apartment.area_sqm || 0,
      aboutApartment: apartment.about || "",
      entryDate: apartment.available_entry_date,
      floor: apartment.floor,
      // Include all original data for completeness
      ...apartment,
    };
  };
  
  // Helper function to transform user data from API to component format
  export const transformUserData = (user) => {
    if (!user) return null;
  
    // Extract user details if nested
    const userDetails = user.user_details || user;
  
    return {
      id: userDetails.id,
      name: `${userDetails.first_name || ""} ${
        userDetails.last_name || ""
      }`.trim(),
      profile_image: userDetails.photo_url || null,
      facebook_link: userDetails.facebook_link || null,
      bio: userDetails.about_me || "No bio available",
      age: calculateAge(userDetails.birth_date),
      university: userDetails.university || userDetails.preferred_city || null,
      // Include all original data for completeness
      ...user,
    };
  };
  
  // Helper function to calculate age from birth_date
  export const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
  
    try {
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
  
      // Adjust age if birthday hasn't occurred yet this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
  
      return age;
    } catch (error) {
      console.error("Error calculating age:", error);
      return null;
    }
  };
  
  
  