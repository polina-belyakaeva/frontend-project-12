const authHeader = (Headers, { getState }) => {
  const { token } = getState().auth;
  if (token) {
    Headers.set("Authorization", `Bearer ${token}`);
  }
  return Headers;
};

export default authHeader;
