const endpoints = {
  login: "/api/v1/authenticate/login/",
  register: "/api/v1/authenticate/register/",
  validateUnique: "/api/v1/authenticate/validate-unique/",
  myApartments: "/api/v1/apartments/my/",
  profile: "/api/v1/user/profile/",
  GET_APARTMENTS: "/api/v1/apartments/recommendations/",
  filters: "/api/v1/users/preferences/",
  preferencesPayload: "/api/v1/users/preferences/payload/",
  questions: "/api/v1/questionnaire/",
  answers: "/api/v1/questionnaire/responses/"
};

export default endpoints;
