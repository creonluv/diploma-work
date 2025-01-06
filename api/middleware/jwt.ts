import jwt from "jsonwebtoken";
import createError from "../utils/createError";

export const verifyToken = (req, _, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(createError(401, "USER_NOT_AUTHENTICATED"));
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      return next(createError(403, "TOKEN_NOT_VALID"));
    }

    req.userId = payload.id;
    req.isSeller = payload.isSeller;

    next();
  });
};
