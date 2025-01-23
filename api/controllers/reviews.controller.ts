import { validationResult } from "express-validator";
import Review from "../models/review.model";
import Gig from "../models/gig.model";
import User from "../models/user.model";

export const createReview = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, targetId } = req.body;

  try {
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
    const reviews = await Review.find(filters);

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
