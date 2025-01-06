import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.model";
import Profile from "../models/profile.model";
import createError from "../utils/createError";

const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      isSeller: user.isSeller,
    },
    process.env.JWT_KEY as string,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_KEY as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      createError(400, "VALIDATION_FAILED", { errors: errors.array() })
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { password, isSeller, ...userData } = req.body;

    const hash = bcrypt.hashSync(password, 5);
    const profileType = isSeller ? "employer" : "freelancer";

    const newUser = new User({
      ...userData,
      password: hash,
      isSeller,
    });

    await newUser.save({ session });

    const newProfile = new Profile({
      profileType: profileType,
      userId: newUser._id,
    });

    await newProfile.save({ session });

    newUser.profileId = newProfile._id;

    await newUser.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "User has been created successfully.",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profileId: newUser.profileId,
      },
    });
  } catch (err: any) {
    await session.abortTransaction();

    if (err.code === 11000) {
      next(createError(400, "User with this email already exists."));
    } else {
      next(err);
    }
  } finally {
    session.endSession();
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return next(createError(404, "USER_NOT_FOUND"));
    }

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect) {
      return next(createError(400, "INVALID_PASSWORD_OR_USERNAME"));
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const { password, ...info } = user.toObject();

    res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error_type: "NO_REFRESH_TOKEN_PROVIDED" });
  }

  jwt.verify(refreshToken, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error_type: "INVALID_REFRESH_TOKEN" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, isSeller: decoded.isSeller },
      process.env.JWT_KEY,
      { expiresIn: "1m" }
    );

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Access token refreshed successfully." });
  });
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ message: "User has been logged out." });
};

export const checkAuth = (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token is missing.",
      error_type: "NO_ACCESS_TOKEN_PROVIDED",
    });
  }

  jwt.verify(accessToken, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired access token.",
        error_type: "INVALID_ACCESS_TOKEN",
      });
    }

    res.status(200).json({ isAuth: true, user: decoded });
  });
};
