import express from "express";
import { verifyToken } from "../middleware/jwt";
import {
  createReview,
  createReviewForOrder,
  deleteReview,
  getReviews,
} from "../controllers/reviews.controller";
import { createReviewValidationRules } from "../validators/createReviewValidationRules";

const router = express.Router();

router.post("/", createReviewValidationRules, verifyToken, createReview);
router.post("/user", verifyToken, createReviewForOrder);
router.get("/", getReviews);
router.delete("/:id", verifyToken, deleteReview);

export default router;
