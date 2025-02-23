import express from "express";
import { verifyToken } from "../middleware/jwt";

import {
  createContract,
  signContract,
} from "../controllers/contract.controller";

const router = express.Router();

router.post("/create", verifyToken, createContract);
router.post("/sign/:contractId", signContract);

export default router;
