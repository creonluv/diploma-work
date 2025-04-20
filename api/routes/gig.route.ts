import express from "express";
import { verifyToken } from "../middleware/jwt";
import {
  addGigFiles,
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getTopGigs,
  getUserGigs,
  updateGig,
  uploadGigImages,
} from "../controllers/gig.controller";
import { gigValidationRules } from "../validators/gigValidationRules";

const router = express.Router();

router.post("/", gigValidationRules, createGig);
router.get("/top", getTopGigs);
router.post("/:gigId/files", uploadGigImages, addGigFiles);
router.patch("/:id", verifyToken, updateGig);
router.get("/user", verifyToken, getUserGigs);
router.get("/:id", getGig);
router.get("/", getGigs);
router.delete("/:id", verifyToken, deleteGig);

export default router;
