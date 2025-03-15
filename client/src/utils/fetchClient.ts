import { handleRefresh } from "../helpers/handleRefreshToken";
import { ErrorType } from "../types/Auth";

export const BASE_URL = "http://localhost:8800/api";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

async function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: any = null
): Promise<T> {
  const options: RequestInit = {
    method,
    credentials: "include",
  };

  if (data) {
    options.body = JSON.stringify(data);

    options.headers = {
      "Content-Type": "application/json; charset=UTF-8",
    };
  }

  try {
    const response = await fetch(BASE_URL + url, options);
    let error;
    const responseText = await response.text();

    if (!response.ok) {
      error = JSON.parse(responseText);
      console.log(error);
      console.log(error, error.error_type);

      if (
        response.status === 400 &&
        error?.error_type === ErrorType.VALIDATION_FAILED
      ) {
        console.log("Invalid data during registration.");
      }

      if (
        (response.status === 401 || response.status === 403) &&
        (error?.error_type === ErrorType.TOKEN_NOT_VALID ||
          error?.error_type === "JWT_EXPIRED" ||
          error?.error_type === ErrorType.INVALID_ACCESS_TOKEN)
      ) {
        await handleRefresh();
        return request<T>(url, method, data);
      }

      if (
        response.status === 400 &&
        error?.error_type === ErrorType.INVALID_PASSWORD_OR_USERNAME
      ) {
        console.log("Invalid login data.");
      }

      if (
        response.status === 401 &&
        error?.error_type === ErrorType.USER_NOT_AUTHENTICATED
      ) {
        // window.history.pushState({}, "", "/login");
      }

      if (
        response.status === 403 &&
        error?.error_type === ErrorType.INVALID_REFRESH_TOKEN
      ) {
        // window.history.pushState({}, "", "/login");
      }

      try {
        error = JSON.parse(responseText);
      } catch {
        error = { error_type: "UNKNOWN_ERROR", message: responseText };
      }

      throw new Error(`Помилка мережі: ${response.status} - ${error.message}`);
    }

    return responseText ? JSON.parse(responseText) : ({} as T);
  } catch (error) {
    console.error("An error occurred while retrieving data:", error);
    throw error;
  }
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, "POST", data),
  patch: <T>(url: string, data: any) => request<T>(url, "PATCH", data),
  put: <T>(url: string, data: any) => request<T>(url, "PUT", data),
  delete: <T>(url: string) => request<T>(url, "DELETE"),
};
