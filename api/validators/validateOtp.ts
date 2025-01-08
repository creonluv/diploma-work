import OTP from "../models/otp.model";
import { Request, Response, NextFunction } from "express";

export const validateOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      res.status(400).json({ error: "INVALID_OTP" });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(400).json({ error: "OTP_EXPIRED" });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};
