// utils/validators.js
import { body, validationResult } from "express-validator";
import { ErrorHandler } from "./utility.js";

// Validation middleware to handle validation results
const validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    const errorMessage = errors.array().map((error) => error.msg).join(", ");

    if (errors.isEmpty()) return next();
    next(new ErrorHandler(errorMessage, 400));
};

// Validators for user registration
const registerValidator = () => [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Provide a valid email'),
    body('mobileNumber').isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10 and 15 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validators for user login
const loginValidator = () => [
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Validators for adding an expense
const addExpenseValidator = () => [
    body('description').notEmpty().withMessage('Provide a description for the expense'),
    body('amount').isFloat({ min: 0 }).withMessage('Provide a valid amount'),
    body('splitMethod').isIn(['equal', 'exact', 'percentage']).withMessage('Provide a valid split method'),
    body('participants').isArray({ min: 1 }).withMessage('Provide at least one participant'),
    body('participants.*.user').isMongoId().withMessage('Provide a valid user ID for each participant'),
    body('participants.*.amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('participants.*.percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100')
];

export { validateHandler, registerValidator, loginValidator, addExpenseValidator };
