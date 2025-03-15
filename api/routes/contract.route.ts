import express from "express";
import { verifyToken } from "../middleware/jwt";

import {
  createContract,
  getAllContracts,
  getContractById,
  signContract,
} from "../controllers/contract.controller";

const router = express.Router();

router.post("/create", verifyToken, createContract);
router.post("/sign/:contractId", signContract);
router.get("/contracts", getAllContracts);
router.get("/contracts/:contractId", getContractById);

export default router;
