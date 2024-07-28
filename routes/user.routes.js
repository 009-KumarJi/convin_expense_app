// routes/user.routes.js
import express from "express";
import { loginValidator, registerValidator, validateHandler } from "../utils/validators.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getMyProfile, login, logout, register } from "../controllers/user.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", registerValidator(), validateHandler, register);

// Login a user
router.post("/login", loginValidator(), validateHandler, login);

// Middleware to check if user is authenticated
router.use(isAuthenticated);

// Get authenticated user's profile
router.get("/profile", getMyProfile);

// Logout a user
router.get("/logout", logout);

export default router;
