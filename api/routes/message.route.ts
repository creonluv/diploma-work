import express from "express";
import {
  createMessage,
  getMessages,
  markMessagesAsRead,
} from "../controllers/message.controller";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessages);
router.put("/read/:id", verifyToken, markMessagesAsRead);

export default router;
