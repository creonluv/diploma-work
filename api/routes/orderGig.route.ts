import express from "express";
import { verifyToken } from "../middleware/jwt";

import { confirm, getOrders, intent } from "../controllers/orderGig.controller";

const router = express.Router();

router.post("/create-payment-intent/:id", verifyToken, intent);
router.get("/", verifyToken, getOrders);
router.put("/confirm", verifyToken, confirm);

export default router;
