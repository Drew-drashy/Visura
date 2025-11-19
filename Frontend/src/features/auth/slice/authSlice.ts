import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, AuthState } from '../types';

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
  error: null,
  loginForm: {
    email: "",
    password: "",
    rememberMe: false,
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Save tokens + user → also persist in localStorage
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      console.log(action)
      state.user = action.payload.user;
      state.tokens = action.payload.accessToken;
      state.status = 'succeeded';
      state.error = null;

      // save to localStorage
      localStorage.setItem("auth_tokens", JSON.stringify(action.payload.accessToken));
      localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
    },

    // Remove everything (Redux + localStorage)
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("auth_tokens");
      localStorage.removeItem("auth_user");
    },

    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Restore session at app startup
    restoreSession: (state) => {
      const storedTokens = localStorage.getItem("auth_tokens");
      const storedUser = localStorage.getItem("auth_user");

      if (storedTokens) state.tokens = JSON.parse(storedTokens);
      if (storedUser) state.user = JSON.parse(storedUser);

      if (storedTokens || storedUser) state.status = "succeeded";
    }
  },
});

export const { logout, setCredentials, setAuthError, restoreSession } = authSlice.actions;
export default authSlice.reducer;
