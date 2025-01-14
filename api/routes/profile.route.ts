import express from "express";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadMiddleware,
  getAllProfiles,
  addSkillsToProfile,
  removeSkillFromProfile,
  updateProfileImage,
} from "../controllers/profile.controller";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.get("/:id", getProfile);
router.get("/", getAllProfiles);
router.post("/:id/add-skills", addSkillsToProfile);
router.post("/:id/remove-skill", removeSkillFromProfile);
router.patch("/:id", verifyToken, uploadMiddleware, updateProfile);
router.delete("/:id", verifyToken, deleteProfile);
router.patch(
  "/:id/update-profile-image",
  verifyToken,
  uploadMiddleware,
  updateProfileImage
);

export default router;
