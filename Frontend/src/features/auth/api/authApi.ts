import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResponse, LoginRequest, SignupRequest, AuthUser } from '../types';
import { AUTH_LOGIN_URL, AUTH_ME_URL, AUTH_REGISTER_URL } from '../../../constants/url';
import { setCredentials } from '../slice/authSlice';

type RootStateForHeader = {
  auth?: {
    tokens: {
      accessToken?: string;
    } | null;
  };
};


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootStateForHeader)?.auth?.tokens?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: AUTH_LOGIN_URL,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials(data)); // 👈 Save tokens + user in Redux/localStorage

        } catch (error) {
          console.error("Login error:", error);
        }
      }
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (payload) => ({
        url: AUTH_REGISTER_URL,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          
          dispatch(setCredentials(data)); 

        } catch (error) {
          console.error("Signup error:", error);
        }
      }
    }),
    getProfile: builder.query<AuthUser, void>({
      query: () => ({
        url: AUTH_ME_URL,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery, util: authApiUtils } = authApi;

