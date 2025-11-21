import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, AuthState, AuthTokens, AuthUser } from '../types';

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
      state.user = action.payload.user;
      state.tokens = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      state.status = 'succeeded';
      state.error = null;

      // save to localStorage
      localStorage.setItem("auth_tokens", JSON.stringify(state.tokens));
      localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
    },

    // Update only the tokens (used after refresh)
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      state.status = 'succeeded';
      localStorage.setItem("auth_tokens", JSON.stringify(action.payload));
    },

    // Update user profile without touching tokens
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
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

      if (storedTokens) {
        const parsed = JSON.parse(storedTokens);
        state.tokens =
          typeof parsed === 'string'
            ? { accessToken: parsed }
            : parsed;
      }
      if (storedUser) state.user = JSON.parse(storedUser);

      if (storedTokens || storedUser) state.status = "succeeded";
    }
  },
});

export const { logout, setCredentials, setTokens, setUser, setAuthError, restoreSession } = authSlice.actions;
export default authSlice.reducer;
