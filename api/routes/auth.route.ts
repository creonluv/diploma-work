import express from "express";
import {
  checkAuth,
  register,
  login,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller";
import { validateRegister } from "../validators/register.validator";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/checkAuth", checkAuth);

export default router;
