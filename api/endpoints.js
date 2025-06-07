// endpoints.js
const withBase = (base, paths) =>
  Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, `${base}${path}`]));

const endpoints = {
  auth: withBase("/api/v1/authenticate/", {
    login: "login/",
    register: "register/",
    validateUnique: "validate-unique/",
    refreshToken: "token/refresh/",
    logout: "logout/",
  }),

  //my apartments
  myApartments: "/api/v1/apartments/my/",
  DeleteApartment: (apartmentId) => `/api/v1/apartments/${apartmentId}/`,

  profile: "/api/v1/users/me/",
  users: "/api/v1/users", 
  GET_APARTMENTS: "/api/v1/apartments/recommendations/",
  filters: "/api/v1/users/preferences/",
  newApartment: "/api/v1/apartments/new/",
  likeUser: "/api/v1/users/like/",

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


  // chat endpoints
  chatRooms: "/api/v1/chat/rooms/",
};

export default endpoints;
