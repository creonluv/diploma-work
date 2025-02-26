import Stripe from "stripe";
import gigModel from "../models/gig.model";
import orderGigModel from "../models/orderGig.model";
import userModel from "../models/user.model";

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE || "");

  const gig = await gigModel.findById(req.params.id);

  if (!gig) {
    return next(new Error("Gig not found"));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const existingOrder = await orderGigModel.findOne({
    payment_intent: paymentIntent.id,
  });

  if (existingOrder) {
    return res.status(400).send("Order already exists.");
  }

  const newOrder = new orderGigModel({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderGigModel.find({
      $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
      isCompleted: true,
    });

    const sellerIds = orders.map((order) => order.sellerId);
    const buyerIds = orders.map((order) => order.buyerId);

    const sellers = await userModel.find({ _id: { $in: sellerIds } });
    const buyers = await userModel.find({ _id: { $in: buyerIds } });

    const sellerNames: Record<string, string> = sellers.reduce(
      (acc, seller) => {
        acc[seller._id.toString()] = seller.username; // Перетворюємо ObjectId в string
        return acc;
      },
      {}
    );

    const buyerNames: Record<string, string> = buyers.reduce((acc, buyer) => {
      acc[buyer._id.toString()] = buyer.username;
      return acc;
    }, {});

    const ordersWithNames = orders.map((order) => {
      return {
        ...order.toObject(),
        sellerName: sellerNames[order.sellerId.toString()] || null,
        buyerName: buyerNames[order.buyerId.toString()] || null,
      };
    });

    res.status(200).send(ordersWithNames);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const order = await orderGigModel.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      { $set: { isCompleted: true } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order has been confirmed", order });
  } catch (err) {
    next(err);
  }
};
