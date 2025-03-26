import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { encryptPrivateKey } from "../utils/encryptPrivateKey";

import User from "../models/user.model";
import Profile from "../models/profile.model";
import createError from "../utils/createError";
import OTP from "../models/otp.model";

const generateTokens = (user) => {
  console.log("jwt");
  console.log(user);

  const accessToken = jwt.sign(
    {
      id: user._id,
      isSeller: user.isSeller,
    },
    process.env.JWT_KEY as string,
    { expiresIn: "3m" }
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

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  return { publicKey, privateKey };
};

export const register = async (req, res, next) => {
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

    const { publicKey, privateKey } = generateKeyPair();

    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    const hash = bcrypt.hashSync(password, 5);
    const profileType = isSeller ? "employer" : "freelancer";

    const newUser = new User({
      ...userData,
      password: hash,
      publicKey,
      encryptedPrivateKey,
      isSeller,
    });

    await newUser.save({ session });

    const profileDetails = isSeller
      ? { employerDetails: { companyName: "", employeesCount: 0 } }
      : { freelancerDetails: { skills: [], portfolio: [] } };

    const newProfile = new Profile({
      profileType: profileType,
      userId: newUser._id,
      ...profileDetails,
    });

    await newProfile.save({ session });

    newUser.profileId = newProfile._id;

    await newUser.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      profileId: newUser.profileId,
      publicKey,
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
    .clearCookie("refreshToken", {
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

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send OTP email.");
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "USER_NOT_FOUND"));
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt: otpExpiry });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return next(createError(400, "INVALID_OTP"));
    }

    if (otpRecord.expiresAt < new Date()) {
      return next(createError(400, "OTP_EXPIRED"));
    }

    const hash = bcrypt.hashSync(newPassword, 5);

    await User.updateOne({ email }, { password: hash });

    await OTP.deleteOne({ email, otp });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
};
