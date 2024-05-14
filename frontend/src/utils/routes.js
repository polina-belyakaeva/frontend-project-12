const apiPath = "/api/v1";

export const ROUTES = {
  apiPath,
  home: "/",
  login: "/login",
  signup: "/signup",
};

export const API_ROUTES = {
  signup: () => [apiPath, "signup"].join("/"),
  login: () => [apiPath, "login"].join("/"),
  messages: () => [apiPath, "messages"].join("/"),
  channels: () => [apiPath, "channels"].join("/"),
};
