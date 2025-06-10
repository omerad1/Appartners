const withBase = (base, paths) =>
  Object.fromEntries(
    Object.entries(paths).map(([key, val]) => [
      key,
      typeof val === "function" ? (...args) => base + val(...args) : base + val,
    ])
  );
const endpoints = {

  //auth related endpoints login/register/logout
  auth: withBase("/api/v1/authenticate/", {
    login: "login/",
    register: "register/",
    validateUnique: "validate-unique/",
    refreshToken: "token/refresh/",
    logout: "logout/",
  }),

  //apartments related endpoints
  apartments: withBase("/api/v1/apartments/",{
    getMy: "my/",
    create: "new/",
    getSwipes: "recommendations/",
    delete: (apartmentId) => `${apartmentId}/`,
    update: (apartmentId) => `${apartmentId}/`,
    preference: "preference/",
    getLikedMy: "likers/",
    getMyLikes: "liked/"
  }),

  // users related endpoints
  users: withBase("/api/v1/users/",{
    getMe: "me/",
    filters: "preferences/" ,
    likeUser: "like/",
    updatePassword: "update-password/",
    updateProfile: "update-details/",
    fetch: (userId) => `${userId}/`

  }),

  questions: withBase("/api/v1/questionnaire/",{
    getQuestions: "",
    answers: "responses/",
  }),

  // app data
  preferencesPayload: "/api/v1/users/preferences/payload/",


  // chat endpoints
  chatRooms: "/api/v1/chat/rooms/",
};

export default endpoints;
