export interface CustomError extends Error {
  status: number;
  errors?: any;
}

export interface ErrorOptions {
  errors?: any;
}
