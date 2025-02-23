import { String } from "aws-sdk/clients/apigateway";
import { AuthData, AuthResponse, UserDataForReset } from "../types/Auth";
import { client } from "../utils/fetchClient";

export const registration = (
  data: AuthData
  // publicKey: string,
  // encryptedPrivateKey: string
): Promise<AuthResponse> => {
  // const registrationData = { ...data, publicKey, encryptedPrivateKey };

  return client.post<AuthResponse>(`/auth/register`, data);
};

export const login = (data: AuthData): Promise<AuthResponse> => {
  return client.post<AuthResponse>(`/auth/login`, data);
};

export const refresh = () => {
  return client.post(`/auth/refresh`, null);
};

export const checkAuth = (): Promise<void> => {
  return client.get(`/auth/checkAuth`);
};

export const logout = (): Promise<void> => {
  return client.post(`/auth/logout`, null);
};

export const requestReset = (data: { email: String }): Promise<void> => {
  return client.post(`/auth/request-reset`, data);
};

export const resetPassword = (data: UserDataForReset): Promise<void> => {
  return client.post(`/auth/reset-password`, data);
};
