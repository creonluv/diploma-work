import jwt from "jsonwebtoken";
import createError from "../utils/createError";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error_type: "USER_NOT_AUTHENTICATED" });
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      return res.status(403).json({ error_type: "TOKEN_NOT_VALID" });
    }

    req.userId = payload.id;
    req.isSeller = payload.isSeller;

    next();
  });
};
