import express from "express";
import {
  checkAuth,
  register,
  login,
  refreshAccessToken,
  logout,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controller";
import { validateRegister } from "../validators/register.validator";
import { validateOtp } from "../validators/validateOtp";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/checkAuth", checkAuth);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", validateOtp, resetPassword);

export default router;
