import { TryCatch } from "../middlewares/error.middleware.js";
import { ErrorHandler } from "../utils/utility.js";
import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import {generateCSV, generatePDF} from "../helper/balancesheet.helper.js";

// Add a new expense
const addExpense = TryCatch(async (req, res, next) => {
    const { description, amount, splitMethod, participants } = req.body;
    const createdBy = req.userId;

    // Validate the split method
    if (splitMethod === "percentage") {
        const totalPercentage = participants.reduce((sum, participant) => sum + (participant.percentage || 0), 0);
        if (totalPercentage !== 100) {
            return next(new ErrorHandler("Total percentage must add up to 100%", 400));
        }
    }

    const expense = await Expense.create({
        description,
        amount,
        splitMethod,
        participants,
        createdBy
    });

    res.status(201).json({
        success: true,
        message: "Expense added successfully!",
        expense
    });
});

// Retrieve all expenses
const getAllExpenses = TryCatch(async (req, res, next) => {
    const expenses = await Expense.find();

    res.status(200).json({
        success: true,
        message: "All expenses fetched successfully",
        expenses
    });
});

// Retrieve an expense by ID
const getExpenseById = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) return next(new ErrorHandler("Expense not found", 404));

    res.status(200).json({
        success: true,
        message: "Expense fetched successfully",
        expense
    });
});

// Update an expense
const updateExpense = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { description, amount, splitMethod, participants } = req.body;

    // Validate the split method
    if (splitMethod === "percentage") {
        const totalPercentage = participants.reduce((sum, participant) => sum + (participant.percentage || 0), 0);
        if (totalPercentage !== 100) {
            return next(new ErrorHandler("Total percentage must add up to 100%", 400));
        }
    }

    const expense = await Expense.findByIdAndUpdate(id, { description, amount, splitMethod, participants }, { new: true });

    if (!expense) return next(new ErrorHandler("Expense not found", 404));

    res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        expense
    });
});

// Delete an expense
const deleteExpense = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) return next(new ErrorHandler("Expense not found", 404));

    res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
        expense
    });
});

// Retrieve individual user expenses
const getUserExpenses = TryCatch(async (req, res, next) => {
    const { userId } = req.params;
    const expenses = await Expense.find({ "participants.user": userId });

    res.status(200).json({
        success: true,
        message: "User expenses fetched successfully",
        expenses
    });
});

// Download balance sheet
const getBalanceSheet = TryCatch(async (req, res, next) => {
    const { type } = req.body; // Expected types: 'csv', 'pdf', 'doc'
    const expenses = await Expense.find();
    const balanceSheet = {};

    expenses.forEach(expense => {
        expense.participants.forEach(participant => {
            const userId = participant.user.toString();
            if (!balanceSheet[userId]) {
                balanceSheet[userId] = 0;
            }
            balanceSheet[userId] += participant.amount || (expense.amount * (participant.percentage / 100));
        });
    });

    const userDetails = await User.find({ _id: { $in: Object.keys(balanceSheet) } }).select('name email');
    const balanceSheetWithDetails = userDetails.map(user => ({
        user: user._id,
        name: user.name,
        email: user.email,
        balance: balanceSheet[user._id.toString()]
    }));

    switch (type) {
        case "csv":
            generateCSV(res, balanceSheetWithDetails, next);
            break;
        case "pdf":
            generatePDF(res, balanceSheetWithDetails, next);
            break;
        default:
            res.status(200).json({
                success: true,
                message: "Balance sheet fetched successfully",
                balanceSheet: balanceSheetWithDetails
            });
    }
});

export { addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, getUserExpenses, getBalanceSheet };
