import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { AuthResponse, LoginRequest, SignupRequest, AuthUser, AuthTokens, VideoItem } from '../types';
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_ME_URL,
  AUTH_REFRESH_URL,
  AUTH_REGISTER_URL,
  AUTH_FORGOT_URL,
  AUTH_RESET_URL,
  AUTH_UPDATE_URL,
  VIDEO_LIST_URL,
} from '../../../constants/url';
import { logout, setCredentials, setTokens, setUser } from '../slice/authSlice';

type RootStateForHeader = {
  auth?: {
    tokens: {
      accessToken?: string;
      refreshToken?: string;
    } | null;
  };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootStateForHeader)?.auth?.tokens?.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const getPersistedRefreshToken = () => {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const parsed = JSON.parse(stored) as AuthTokens;
      return parsed.refreshToken;
    }
  } catch (error) {
    console.warn('Unable to read persisted tokens', error);
  }
  return undefined;
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state = api.getState() as RootStateForHeader;
    const refreshToken = state.auth?.tokens?.refreshToken ?? getPersistedRefreshToken();

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: AUTH_REFRESH_URL,
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const refreshedTokens = refreshResult.data as AuthTokens;

      if (refreshedTokens?.accessToken) {
        api.dispatch(setTokens(refreshedTokens));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else if (refreshResult.error) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Videos'],
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

          dispatch(setCredentials(data)); // Save tokens + user in Redux/localStorage
        } catch (error) {
          console.error("Login error:", error);
        }
      },
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
      },
    }),
    getProfile: builder.query<AuthUser, void>({
      query: () => ({
        url: AUTH_ME_URL,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    getVideos: builder.query<{ count: number; videos: VideoItem[] }, void>({
      query: () => ({
        url: VIDEO_LIST_URL,
        method: 'GET',
      }),
      providesTags: ['Videos'],
    }),
    updateProfile: builder.mutation<AuthUser, Partial<AuthUser>>({
      query: (payload) => ({
        url: AUTH_UPDATE_URL,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error('Update profile error:', error);
        }
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (payload) => ({
        url: AUTH_FORGOT_URL,
        method: 'POST',
        body: payload,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { email: string; token: string; newPassword: string }>({
      query: (payload) => ({
        url: AUTH_RESET_URL,
        method: 'POST',
        body: payload,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: (_arg, { getState }) => {
        const state = getState() as RootStateForHeader;
        const refreshToken = state.auth?.tokens?.refreshToken ?? getPersistedRefreshToken();
        return {
          url: AUTH_LOGOUT_URL,
          method: 'POST',
          body: { refreshToken: refreshToken ?? '' },
        };
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  useGetVideosQuery,
  useLazyGetVideosQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  util: authApiUtils,
} = authApi;
