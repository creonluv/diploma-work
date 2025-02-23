import { body } from "express-validator";

export const bidValidationRules = [
  body("proposal")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Proposal must be between 10 and 1000 characters."),
  body("bidAmount")
    .isNumeric()
    .withMessage("Bid amount must be a number.")
    .custom((value) => value > 0)
    .withMessage("Bid amount must be greater than 0."),
  body("estimatedTime")
    .isNumeric()
    .withMessage("Estimated time must be a number.")
    .custom((value) => value > 0)
    .withMessage("Estimated time must be greater than 0."),
];
