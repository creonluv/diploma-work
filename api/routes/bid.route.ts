import express from "express";
import { verifyToken } from "../middleware/jwt";
import { bidValidationRules } from "../validators/bidValidation";
import {
  addBidToJob,
  getBidsForJob,
  updateBid,
  deleteBid,
} from "../controllers/bid.controller";

const router = express.Router();

router.post("/:jobId", verifyToken, bidValidationRules, addBidToJob);
router.get("/:jobId", verifyToken, getBidsForJob);
router.put("/:bidId", verifyToken, bidValidationRules, updateBid);
router.delete("/:bidId", verifyToken, deleteBid);

export default router;
