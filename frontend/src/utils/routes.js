export const apiPath = "/api/v1";

export const ROUTES = {
  apiPath,
  home: "/",
  login: "/login",
  signup: "/signup",
};

export const API_ROUTES = {
  signup: () => `${apiPath}/signup`,
  login: () => `${apiPath}/login`,
  messages: () => `${apiPath}/messages`,
  channels: () => `${apiPath}/channels`,
};
