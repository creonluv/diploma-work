import Stripe from "stripe";
import gigModel from "../models/gig.model";
import orderGigModel from "../models/orderGig.model";

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
  console.log(req.userId);

  try {
    const orders = await orderGigModel.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  console.log(req.body.payment_intent);

  try {
    const orders = await orderGigModel.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
