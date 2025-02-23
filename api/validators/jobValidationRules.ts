import { body } from "express-validator";

export const jobValidationRules = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters."),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters."),
  body("budget")
    .isNumeric()
    .withMessage("Budget must be a number.")
    .custom((value) => value > 0)
    .withMessage("Budget must be greater than 0."),
  body("deadline")
    .isISO8601()
    .withMessage("Deadline must be a valid date in ISO 8601 format.")
    .custom((value) => new Date(value) > new Date())
    .withMessage("Deadline must be in the future."),
  body("tags")
    .isArray({ min: 1 })
    .withMessage("At least one tag is required.")
    .custom((tags) => tags.every((tag) => typeof tag === "string"))
    .withMessage("Tags must be an array of strings."),
];
