import { body } from "express-validator";

export const gigValidationRules = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters."),
  body("desc")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters."),
  body("cat").notEmpty().withMessage("Category is required."),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number.")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0."),
  body("shortTitle")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Short title must be between 3 and 50 characters."),
  body("shortDesc")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Short description must be between 5 and 200 characters."),
  body("deliveryTime")
    .isNumeric()
    .withMessage("Delivery time must be a number.")
    .custom((value) => value > 0)
    .withMessage("Delivery time must be greater than 0."),
];
