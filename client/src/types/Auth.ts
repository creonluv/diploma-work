import { User } from "./User";

export interface AuthData {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  isSeller?: boolean;
}

export interface AuthResponse extends User {}

export enum ErrorType {
  VALIDATION_FAILED = "VALIDATION_FAILED",
  INVALID_PASSWORD_OR_USERNAME = "INVALID_PASSWORD_OR_USERNAME",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  NO_REFRESH_TOKEN_PROVIDED = "NO_REFRESH_TOKEN_PROVIDED",
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
  INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN",
  TOKEN_NOT_VALID = "TOKEN_NOT_VALID",
  USER_NOT_AUTHENTICATED = "USER_NOT_AUTHENTICATED",
  NO_ACCESS_TOKEN_PROVIDED = "NO_ACCESS_TOKEN_PROVIDED",
}

export interface UserDataForReset {
  email: string;
  otp: string;
  newPassword: string;
}
