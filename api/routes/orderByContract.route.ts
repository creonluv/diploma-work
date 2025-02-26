import express from "express";
import {
  createOrder,
  confirmOrCancelPayment,
  getOrdersByContract,
} from "../controllers/orderByContract.controller";

const router = express.Router();

router.post("/create-order/:contractId", createOrder);
router.post("/confirm-or-cancel-payment", confirmOrCancelPayment);
router.get("/:contractId", getOrdersByContract);

export default router;
