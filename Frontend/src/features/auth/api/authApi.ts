import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResponse, LoginRequest, SignupRequest, AuthUser } from '../types';

type RootStateForHeader = {
  auth?: {
    tokens: {
      accessToken?: string;
    } | null;
  };
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (payload) => ({
        url: '/auth/signup',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
    }),
    getProfile: builder.query<AuthUser, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery, util: authApiUtils } = authApi;

