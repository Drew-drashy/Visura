import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
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
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.status = 'succeeded';
      state.error = null;
    },
    logout: () => initialState,
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
   setemail: (state, action: PayloadAction<string>) => {
    state.loginForm.email = action.payload;
   },
   setpassword: (state, action: PayloadAction<string>) => {
    state.loginForm.password = action.payload;
   },
   setrememberMe: (state, action: PayloadAction<boolean>) => {
    state.loginForm.rememberMe = action.payload;
   },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(authApi.endpoints.getProfile.matchPending, (state) => {
        state.status = 'loading';
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload.user;
        state.tokens = payload.tokens;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload.user;
        state.tokens = payload.tokens;
      })
      .addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Unable to sign in';
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Unable to sign up';
      })
      .addMatcher(authApi.endpoints.getProfile.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Unable to fetch profile';
      });
  },
});

export const { logout, setCredentials, setAuthError, setemail, setpassword, setrememberMe } = authSlice.actions;

export default authSlice.reducer;

