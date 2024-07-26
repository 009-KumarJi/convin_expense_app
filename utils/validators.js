import {body, validationResult} from "express-validator";
import {ErrorHandler} from "./utility.js";

const validateHandler = (req, res, next) => {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    const errorMessage = errors.array().map((error) => error.msg).join(", ");

    if (errors.isEmpty()) return next();
    next(new ErrorHandler(errorMessage, 400));
};

const registerValidator = () => [
    body("name", "Enter name!").notEmpty(),
    body("username", "Enter username!").notEmpty(),
    body("password", "Enter password!").notEmpty(),
    body("dob", "Enter date of birth!").notEmpty(),
    body("email", "Enter email address!").isEmail(),
];
const loginValidator = () => [
    body("username", "Enter username!").notEmpty(),
    body("password", "Enter password!").notEmpty(),
];