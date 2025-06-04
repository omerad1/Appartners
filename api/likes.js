import api from "./client";
import endpoints from "./endpoints";

// Helper function to transform apartment data from API to component format
const transformApartmentData = (apartment) => {
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
const transformUserData = (user) => {
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
const calculateAge = (birthDateString) => {
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

// Fetch apartments that the user has liked
export const getLikedApartments = async () => {
  try {
    const res = await api.get(endpoints.likedApartments);
    console.log("🏠 Liked apartments:", res.data);
    // Transform the data to match the expected format
    let transformedData;

    if (Array.isArray(res.data)) {
      transformedData = res.data.map((apartment) =>
        transformApartmentData(apartment)
      );
    } else if (res.data && Array.isArray(res.data.results)) {
      transformedData = res.data.results.map((apartment) =>
        transformApartmentData(apartment)
      );
    } else {
      console.warn("Unexpected data format for liked apartments:", res.data);
      transformedData = [];
    }

    console.log("Transformed apartment data:", transformedData);
    return transformedData;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch liked apartments:", message);
    throw new Error(message);
  }
};

// Fetch users who liked the user's apartment
export const getUsersWhoLikedMyApartment = async () => {
  try {
    const res = await api.get(endpoints.usersWhoLikedMyApartment);

    // Transform the data to match the expected format
    let transformedData;

    if (Array.isArray(res.data)) {
      transformedData = res.data.map((user) => transformUserData(user));
    } else if (res.data && Array.isArray(res.data.results)) {
      transformedData = res.data.results.map((user) => transformUserData(user));
    } else {
      console.warn(
        "Unexpected data format for users who liked my apartment:",
        res.data
      );
      transformedData = [];
    }

    console.log("Transformed user data:", transformedData);
    return transformedData;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to fetch users who liked my apartment:", message);
    throw new Error(message);
  }
};

// Like an apartment
export const likeApartment = async (apartmentId) => {
  try {
    const res = await api.post(endpoints.apartmentPreference, {
      apartment_id: apartmentId,
      like: true,
    });
    console.log("❤️ Liked apartment:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to like apartment:", message);
    throw new Error(message);
  }
};

// Unlike an apartment
export const unlikeApartment = async (apartmentId) => {
  try {
    const res = await api.post(endpoints.apartmentPreference, {
      apartment_id: apartmentId,
      like: false,
    });
    console.log("💔 Unliked apartment:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to unlike apartment:", message);
    throw new Error(message);
  }
};

export const likeUser = async (userId, like) => {
  try {
    const res = await api.post(endpoints.likeUser, {
      target_user_id: userId,
      like: like,
    });
    console.log("❤️ Liked user:", res.data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.detail || err.message;
    console.error("❌ Failed to like user:", message);
    throw new Error(message);
  }
};
