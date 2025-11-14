export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthState = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loginForm: {
    email: string,
    password: string
    rememberMe: boolean,
  }
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

