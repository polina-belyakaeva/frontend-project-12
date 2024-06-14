const authHeader = (headers, { getState }) => {
  const token = getState().auth.token;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

export default authHeader;
