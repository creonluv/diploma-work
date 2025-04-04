import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.put("/:id/read", verifyToken, markNotificationAsRead);
router.put("/read-all", verifyToken, markAllNotificationsAsRead);
router.delete("/:id", verifyToken, deleteNotification);
router.delete("/delete-all", verifyToken, deleteAllNotifications);

export default router;
