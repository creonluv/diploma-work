import express from "express";
import { verifyToken } from "../middleware/jwt";
import {
  closeJob,
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  updateJob,
} from "../controllers/job.controller";
import { jobValidationRules } from "../validators/jobValidationRules";

const router = express.Router();

router.post("/", jobValidationRules, verifyToken, createJob);
router.get("/", getAllJobs);
router.get("/:jobId", verifyToken, getJobById);
router.put("/:jobId", verifyToken, updateJob);
router.delete("/:jobId", verifyToken, deleteJob);
router.patch("/:jobId/close", verifyToken, closeJob);

export default router;
