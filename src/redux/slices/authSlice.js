import { createSlice } from '@reduxjs/toolkit';

const initialUser = localStorage.getItem('woodly_user')
  ? JSON.parse(localStorage.getItem('woodly_user'))
  : null;
const initialToken = localStorage.getItem('woodly_token') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('woodly_user', JSON.stringify(action.payload.user));
      localStorage.setItem('woodly_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('woodly_user');
      localStorage.removeItem('woodly_token');
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('woodly_user', JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
