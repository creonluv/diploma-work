import multer from "multer";
import { validationResult } from "express-validator";
import createError from "../utils/createError";
import Gig from "../models/gig.model";
import reviewModel from "../models/review.model";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadGigImages = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const createGig = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.isSeller) {
    return next(createError(403, "Only freelancers can create a gig!"));
  }

  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};

export const addGigFiles = async (req, res, next) => {
  const gigId = req.params.gigId;
  const coverUrl = req.files?.cover?.[0]?.path || null;
  const imageUrls = req.files?.images?.map((file) => file.path) || [];

  console.log(req.files);

  try {
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return next(createError(404, "Gig not found"));
    }

    if (coverUrl) {
      gig.cover = coverUrl;
    }

    if (imageUrls.length > 0) {
      gig.images = imageUrls;
    }

    const updatedGig = await gig.save();
    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};

export const updateGig = async (req, res, next) => {
  const userIdFromToken = req.userId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json("Gig not found!");
    }

    if (gig.userId.toString() !== userIdFromToken) {
      return res.status(403).json("You can only update your own gigs!");
    }

    const updatedGig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedGig);
  } catch (err) {
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("userId")
      .populate({
        path: "gigReviews",
        select: "raterUserId star review createdAt",
        populate: { path: "raterUserId", select: "username" },
      });

    if (!gig) {
      return res.status(404).json("Gig not found!");
    }

    res.status(200).json(gig);
  } catch (err) {
    next(err);
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gte: Number(q.min) }),
        ...(q.max && { $lte: Number(q.max) }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  const allowedSortFields = ["price", "rating", "createdAt", "sales"];
  const sortOption = {};

  if (q.sort && allowedSortFields.includes(q.sort)) {
    sortOption[q.sort] = -1;
  } else {
    sortOption["createdAt"] = -1;
  }

  const page = Number(q.page) || 1;
  const limit = Number(q.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const gigs = await Gig.find(filters)
      .populate({
        path: "gigReviews",
        select: "raterUserId star review",
        populate: { path: "raterUserId", select: "username" },
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("userId");
    const totalCount = await Gig.countDocuments(filters);

    res.status(200).json({
      gigs,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserGigs = async (req, res, next) => {
  console.log(req.userId);

  try {
    const gigs = await Gig.find({ userId: req.userId })
      .populate("userId", "username email")
      .populate({
        path: "gigReviews",
        select: "raterUserId star review createdAt",
        populate: { path: "raterUserId", select: "username" },
      });

    if (!gigs.length) {
      return res.status(404).json({ message: "No gigs found for this user" });
    }

    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json("Gig not found!");
    }

    if (gig.userId.toString() !== req.userId) {
      return res.status(403).json("You can only delete your own gigs!");
    }

    await reviewModel.deleteMany({ _id: { $in: gig.gigReviews } });

    await Gig.findByIdAndDelete(req.params.id);

    res.status(200).json("Gig deleted.");
  } catch (err) {
    next(err);
  }
};

export const getTopGigs = async (req, res, next) => {
  try {
    const topGigs = await Gig.find()
      .sort({ rating: -1 })
      .limit(8)
      .populate("userId", "username profileImage")
      .populate({
        path: "gigReviews",
        select: "raterUserId star review",
        populate: { path: "raterUserId", select: "username" },
      });

    res.status(200).json(topGigs);
  } catch (err) {
    next(err);
  }
};
