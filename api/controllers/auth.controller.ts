import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      createError(400, "Validation failed", { errors: errors.array() })
    );
  }

  try {
    const { password, isSeller, ...userData } = req.body;

    const hash = bcrypt.hashSync(password, 5);

    const profileType = isSeller ? "employer" : "freelancer";

    const newUser = new User({
      ...userData,
      password: hash,
    });

    await newUser.save();

    const newProfile = new Profile({
      profileType: profileType,
      userId: newUser._id,
    });

    await newProfile.save();

    newUser.profileId = newProfile._id;
    await newUser.save();

    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
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
      return next(createError(404, "User not found!"));
    }

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect) {
      return next(createError(400, "Wrong password or username!"));
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
    return next(createError(401, "No refresh token provided!"));
  }

  jwt.verify(refreshToken, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return next(createError(403, "Invalid refresh token!"));
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
      .send("Access token refreshed successfully.");
  });
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
