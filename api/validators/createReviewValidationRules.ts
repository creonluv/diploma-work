import { body } from "express-validator";

import User from "../models/user.model";
import Gig from "../models/gig.model";

export const createReviewValidationRules = [
  body("type")
    .isIn(["gig", "user"])
    .withMessage("Type must be either 'gig' or 'user'"),
  body("targetId")
    .notEmpty()
    .withMessage("Target ID is required")
    .custom((value, { req }) => {
      if (req.body.type === "gig") {
        return Gig.findById(value).then((gig) => {
          if (!gig) {
            return Promise.reject("Gig not found");
          }
        });
      } else if (req.body.type === "user") {
        return User.findById(value).then((user) => {
          if (!user) {
            return Promise.reject("User not found");
          }
        });
      }
      return true;
    }),
  body("star")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Star rating must be between 1 and 5"),
  body("review").optional().isString().withMessage("Review must be a string"),
];
