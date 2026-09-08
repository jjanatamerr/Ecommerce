
import api from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
}

export const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>(
    "/api/v1/auth/login",
    payload
  );

  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>(
    "/api/v1/auth/register",
    payload
  );

  localStorage.setItem("token", res.data.token);

  return res.data;
};

