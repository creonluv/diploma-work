import { body } from "express-validator";

export const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("isSeller")
    .optional()
    .isBoolean()
    .withMessage("isSeller must be a boolean."),
];
