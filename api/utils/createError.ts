import { CustomError, ErrorOptions } from "../types/error";

const createError = (
  status: number,
  message: string,
  options: ErrorOptions = {}
): CustomError => {
  const err = new Error(message) as CustomError;

  err.status = status;
  err.message = message;

  if (options.errors) {
    err.errors = options.errors;
  }

  return err;
};

export default createError;
