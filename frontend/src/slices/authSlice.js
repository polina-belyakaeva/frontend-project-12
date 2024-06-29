import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  /* eslint-disable no-param-reassign */
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUsername(state, action) {
      state.username = action.payload;
      localStorage.setItem('username', action.payload);
    },
    fullLogout: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});

export const { setToken, setUsername, fullLogout } = authSlice.actions;
export default authSlice.reducer;
