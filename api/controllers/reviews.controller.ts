import { validationResult } from "express-validator";
import Review from "../models/review.model";
import Gig from "../models/gig.model";
import User from "../models/user.model";
import Order from "../models/orderByContract.model";

export const createReview = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, targetId } = req.body;

  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User ID not provided!" });
    }

    let target;

    if (type === "gig") {
      target = await Gig.findById(targetId);
      if (!target) {
        return res.status(404).json({ message: "Gig not found!" });
      }
    } else if (type === "user") {
      target = await User.findById(targetId);
      if (!target) {
        return res.status(404).json({ message: "User not found!" });
      }
    } else {
      return res.status(400).json({ message: "Invalid review type!" });
    }

    const newReview = new Review({
      ...req.body,
      raterUserId: req.userId,
    });

    const savedReview = await newReview.save();

    if (type === "gig") {
      target.gigReviews.push(savedReview._id);

      await target.save();

      const allReviews = await Review.find({ targetId: target._id });
      const totalStars = allReviews.reduce(
        (sum, review) => sum + review.star,
        0
      );
      const avgRating = totalStars / allReviews.length;

      target.rating = avgRating;

      await target.save();
    }

    res.status(201).json(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.type && { type: q.type }),
    ...(q.targetId && { targetId: q.targetId }),
    ...(q.raterUserId && { raterUserId: q.raterUserId }),
    ...(q.star && { star: q.star }),
  };

  try {
    const reviews = await Review.find(filters).populate({
      path: "raterUserId",
      select: "username email profileImage",
    });

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  const userIdFromToken = req.userId;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json("Review not found!");
    }

    if (
      !review.raterUserId ||
      review.raterUserId.toString() !== userIdFromToken
    ) {
      return res.status(403).json("You can only delete your own reviews!");
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json("Review deleted.");
  } catch (err) {
    next(err);
  }
};

const updateUserRating = async (userId) => {
  try {
    const reviews = await Review.find({ targetId: userId });
    console.log(`Found ${reviews.length} reviews for user ${userId}`);

    if (reviews.length === 0) {
      console.log("No reviews found. User rating not updated.");
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.star, 0);
    const averageRating = totalRating / reviews.length;
    console.log(`Calculated average rating: ${averageRating}`);

    await User.findByIdAndUpdate(userId, {
      userRating: averageRating.toFixed(2),
    });
    console.log(`Updated rating for user ${userId}: ${averageRating}`);
  } catch (err) {
    console.error("Error updating user rating:", err);
  }
};

export const createReviewForOrder = async (req, res, next) => {
  const { targetId, orderId, ...reviewData } = req.body;
  const userId = req.userId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    if (
      (order.freelancerId.toString() === userId && order.reviews?.freelancer) ||
      (order.employerId.toString() === userId && order.reviews?.employer)
    ) {
      return res
        .status(400)
        .json({ message: "You have already left a review!" });
    }

    const newReview = new Review({
      ...reviewData,
      raterUserId: userId,
      targetId: targetId,
    });

    await newReview.save();

    if (order.freelancerId.toString() === userId && order.reviews) {
      order.reviews.freelancer = newReview._id;
    } else if (order.employerId.toString() === userId && order.reviews) {
      order.reviews.employer = newReview._id;
    }

    await order.save();

    await updateUserRating(targetId);

    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
};
