import Stripe from "stripe";
import Contract from "../models/contract.model";
import Order from "../models/orderByContract.model";
import profileModel from "../models/profile.model";
import jobModel from "../models/job.model";

const stripe = new Stripe(
  "sk_test_51Qne3fBHuhS2Mrw2zWHB2I54HNZar0oNUzTH27ZkJjpMEpGDz49YBEDs44o4r6wUzYSGowLHbAWTWtHntVfCi77Y00lL3Hup3e"
);

export const createOrder = async (req, res, next) => {
  const { contractId } = req.params;

  try {
    const existingOrder = await Order.findOne({ contractId });
    if (existingOrder) {
      return res
        .status(400)
        .send({ error: "Order already exists for this contract." });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return next(new Error("Contract not found"));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: contract.totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      capture_method: "manual",
    });

    const newOrder = new Order({
      jobId: contract.jobId,
      contractId: contract._id,
      freelancerId: contract.freelancerId,
      employerId: contract.employerId,
      price: contract.totalAmount,
      payment_intent: paymentIntent.id,
      status: "in-progress",
      paymentStatus: "pending",
      totalAmount: contract.totalAmount,
      startDate: new Date(),
    });

    await newOrder.save();

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmOrCancelPayment = async (req, res, next) => {
  const { orderId, action } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new Error("Order not found"));
    }

    const contract = await Contract.findById(order.contractId);
    if (!contract) {
      return next(new Error("Contract not found"));
    }

    const job = await jobModel.findById(contract.jobId);
    if (!job) {
      return next(new Error("Job not found"));
    }

    if (action === "confirm") {
      await stripe.paymentIntents.capture(order.payment_intent);

      order.paymentStatus = "paid";
      order.status = "closed";

      await profileModel.findOneAndUpdate(
        { userId: contract.freelancerId },
        {
          $push: {
            "freelancerDetails.portfolio": contract.jobId.toString(),
          },
        }
      );

      await profileModel.findOneAndUpdate(
        { userId: contract.employerId },
        {
          $push: {
            "employerDetails.projects": contract.jobId.toString(),
          },
        }
      );
    } else if (action === "cancel") {
      await stripe.paymentIntents.cancel(order.payment_intent);

      order.paymentStatus = "failed";
      order.status = "closed";
      order.endDate = new Date();
    }

    job.status = "closed";
    await job.save();

    await order.save();
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByContract = async (req, res, next) => {
  const { contractId } = req.params;

  try {
    const orders = await Order.find({ contractId })
      .populate({
        path: "reviews.freelancer",
        populate: {
          path: "raterUserId",
          select: "username email profileImage",
        },
      })
      .populate({
        path: "reviews.employer",
        populate: {
          path: "raterUserId",
          select: "username email avatar profileImage",
        },
      });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this contract" });
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderByPaymentIntent = async (req, res, next) => {
  const { paymentIntentId } = req.params;

  try {
    const order = await Order.findOne({ payment_intent: paymentIntentId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersForUser = async (req, res, next) => {
  const userId = req.userId;

  try {
    const orders = await Order.find({
      $or: [{ freelancerId: userId }, { employerId: userId }],
    })
      .populate("jobId")
      .populate("freelancerId")
      .populate("employerId");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
