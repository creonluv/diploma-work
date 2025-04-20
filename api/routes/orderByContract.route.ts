import express from "express";
import {
  createOrder,
  confirmOrCancelPayment,
  getOrdersByContract,
  getOrderByPaymentIntent,
  getOrdersForUser,
} from "../controllers/orderByContract.controller";
import { verifyToken } from "../middleware/jwt";

const router = express.Router();

router.get("/my", verifyToken, getOrdersForUser);
router.post("/create-order/:contractId", createOrder);
router.post("/confirm-or-cancel-payment", confirmOrCancelPayment);
router.get("/:contractId", getOrdersByContract);
router.get("/payment-intent/:paymentIntentId", getOrderByPaymentIntent);

export default router;
