import express from "express";
import {
  deleteUser,
  getUser,
  getAllUsers,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", getUser);
router.get("/", getAllUsers);

export default router;
