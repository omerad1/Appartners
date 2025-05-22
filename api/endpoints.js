const endpoints = {
  login: "/api/v1/authenticate/login/",
  register: "/api/v1/authenticate/register/",
  validateUnique: "/api/v1/authenticate/validate-unique/",
  refreshToken: "/api/v1/authenticate/token/refresh/",
  logout: "/api/v1/authenticate/logout/",

  //my apartments
  myApartments: "/api/v1/apartments/my/",
  DeleteApartment: (apartmentId) => `/api/v1/apartments/${apartmentId}/`,

  profile: "/api/v1/users/me/",
  users: "/api/v1/users", // Base endpoint for users
  GET_APARTMENTS: "/api/v1/apartments/recommendations/",
  filters: "/api/v1/users/preferences/",
  newApartment: "/api/v1/apartments/new/",

  // app data
  preferencesPayload: "/api/v1/users/preferences/payload/",
  questions: "/api/v1/questionnaire/",

  //users answers
  answers: "/api/v1/questionnaire/responses/",
  updateUserProfile: "/api/v1/users/update-details/",

  // Likes endpoints
  likedApartments: "/api/v1/apartments/liked/",
  usersWhoLikedMyApartment: "/api/v1/apartments/likers/",
  likeApartment: (apartmentId) => `/api/v1/apartments/${apartmentId}/like/`,
  apartmentPreference: "/api/v1/apartments/preference/",
};

export default endpoints;
