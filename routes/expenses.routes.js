import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, getUserExpenses } from "../controllers/expense.controller.js";
import { addExpenseValidator, validateHandler } from "../utils/validators.js";

const router = express.Router();

router.use(isAuthenticated);

// Add a new expense
router.post("/", addExpenseValidator(), validateHandler, addExpense); // --ok

// Retrieve all expenses
router.get("/", getAllExpenses);

// Retrieve an expense by ID
router.get("/:id", getExpenseById);

// Update an expense
router.put("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

// Retrieve individual user expenses
router.get("/user/:userId", getUserExpenses);

export default router;
