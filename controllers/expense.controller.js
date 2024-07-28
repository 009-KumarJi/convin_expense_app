import {TryCatch} from "../middlewares/error.middleware.js";
import {ErrorHandler, sout} from "../utils/utility.js";
import {Expense} from "../models/expense.model.js";
import {User} from "../models/user.model.js";
import {generateCSV} from "../helper/balancesheet.helper.js";

// Add a new expense
const addExpense = TryCatch(async (req, res, next) => {
    let {description, amount, splitMethod, participants} = req.body;
    const createdBy = req.userId;

    // check if participants.user are valid user IDs
    const validUserIds = await User.find({_id: {$in: participants.map((participant) => participant.user)}});
    if (validUserIds.length !== participants.length) {
        return next(new ErrorHandler("Provide a valid user ID for each participant", 400));
    }


    // Validate the split method
    if (splitMethod === "percentage") {
        const totalPercentage = participants.reduce((sum, participant) => sum + (participant.percentage || 0), 0);
        if (totalPercentage !== 100) {
            return next(new ErrorHandler("Total percentage must add up to 100%", 400));
        }
        // calculating the amount for each participant
        participants = participants.map((participant) => {
            const pAmount = (participant.percentage / 100) * amount;
            return {...participant, amount: pAmount};
        });
    }

    // validate exact split method -- amount should be provided for exact split method
    if (splitMethod === "exact") {
        const totalAmount = participants.reduce((sum, participant) => sum + (participant.amount || 0), 0);
        if (totalAmount !== amount || totalAmount === undefined)
            return next(new ErrorHandler("Total amount must be equal to the expense amount", 400));
    }

    // calculating the percentage for each participant if splitMethod is exact
    if (splitMethod === "exact") {
        participants = participants.map((participant) => {
            const percentage = (participant.amount / amount) * 100;
            return {...participant, percentage};
        });
    }

    // calculating the amount and percentage for each participant if splitMethod is equal
    if (splitMethod === "equal") {
        const amountPerParticipant = amount / participants.length;
        participants = participants.map((participant) => ({
            ...participant,
            amount: amountPerParticipant,
            percentage: 100 / participants.length
        }));
    }

    // setting status as pending for all participants if status feild is not present
    participants = participants.map((participant) => ({...participant, status: participant.status || "pending"}));


    const expense = await Expense.create({
        description,
        amount,
        splitMethod,
        participants,
        createdBy,
    });

    res.status(201).json({
        success: true,
        message: "Expense added successfully!",
        expense,
    });
});

// Retrieve all expenses
const getAllExpenses = TryCatch(async (req, res, next) => {
    const expenses = await Expense.find().populate("participants.user", "name email");

    res.status(200).json({
        success: true,
        message: "All expenses fetched successfully",
        expenses,
    });
});

// Retrieve an expense by ID
const getExpenseById = TryCatch(async (req, res, next) => {
    const {id} = req.params;
    const expense = await Expense.findById(id).populate("participants.user", "name email");

    if (!expense) return next(new ErrorHandler("Expense not found", 404));

    res.status(200).json({
        success: true,
        message: "Expense fetched successfully",
        expense,
    });
});

// Update an expense
const updateExpense = TryCatch(async (req, res, next) => {
    const {id} = req.params;
    let {description, amount, splitMethod, participants, status} = req.body;

    const expense = await Expense.findById(id);

    if (!expense) return next(new ErrorHandler("Expense not found", 404));
// Check if user is authorized to update the expense
    const user = req.userId;
    const isParticipant = expense.participants.some((participant) => participant.user.toString() === user);
    const isCreator = expense.createdBy.toString() === user;
    const updateFields = {participants: expense.participants};

// Validate the split method
    if (splitMethod === "percentage" || splitMethod === "exact") {
        if (participants) {
            if (!Array.isArray(participants) || participants.length === 0)
                return next(new ErrorHandler("Participants must be a non-empty array", 400));
        } else {
            return next(new ErrorHandler("Participants field is required", 400));
        }

        if (splitMethod === "percentage") {
            const totalPercentage = updateFields.reduce((sum, participant) => sum + (participant.percentage || 0), 0);
            if (totalPercentage !== 100) {
                return next(new ErrorHandler("Total percentage must add up to 100%", 400));
            }
        } else {
            const totalAmount = updateFields.reduce((sum, participant) => sum + (participant.amount || 0), 0);
            if (totalAmount !== amount) {
                return next(new ErrorHandler("Total amount must be equal to the expense amount", 400));
            }
        }
    }
    if (amount !== expense.amount && !participants && (splitMethod === "exact" || splitMethod === "percentage") && expense.splitMethod !== "equal") {
        if (!participants)
            return next(new ErrorHandler("You have to specify the amount or percentage also", 400));
    }


    if (!isParticipant && !isCreator) {
        return next(new ErrorHandler("You are not authorized to update this expense", 401));
    }
    if (!isCreator && isParticipant && (description || amount || splitMethod || participants)) {
        return next(new ErrorHandler("You are not authorized to update this expense", 401));
    }

    // Update the expense

    if (status) {
        updateFields.participants.forEach((participant) => {
            if (participant.user.toString() === user.toString()) {
                participant.status = status;
            }
        });
    }


    if (isCreator) {
        if (description) updateFields.description = description;
        if (amount && (splitMethod === "equal" || expense.splitMethod === "equal")) {
            updateFields.amount = amount;
            updateFields.participants = updateFields.participants.map((participant) => ({
                ...participant,
                amount: amount / updateFields.participants.length,
                percentage: 100 / updateFields.participants.length,
            }));
        } else if (amount) {
            updateFields.amount = amount;
        }
        if (splitMethod) updateFields.splitMethod = splitMethod;
        if (participants) updateFields.participants = participants;
    }


    sout(updateFields);

    const updatedExpense = await Expense.findByIdAndUpdate(
        id,
        {$set: updateFields},
        {new: true}
    );

    res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        updatedExpense,
    });
});

// Delete an expense
const deleteExpense = TryCatch(async (req, res, next) => {
    const {id} = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) return next(new ErrorHandler("Expense not found", 404));

    res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
        expense,
    });
});

// Retrieve individual user expenses
const getUserExpenses = TryCatch(async (req, res, next) => {
    const {userId} = req.params;
    const expenses = await Expense.find({"participants.user": userId}).populate("participants.user", "name email");

    res.status(200).json({
        success: true,
        message: "User expenses fetched successfully",
        expenses,
    });
});

// Download balance sheet
const getBalanceSheet = TryCatch(async (req, res, next) => {
    const { type } = req.body; // Expected type: 'csv'
    const expenses = await Expense.find();
    const balanceSheet = {};

    expenses.forEach((expense) => {
        expense.participants.forEach((participant) => {
            const userId = participant.user.toString();
            if (!balanceSheet[userId]) {
                balanceSheet[userId] = 0;
            }
            balanceSheet[userId] += participant.amount || (expense.amount * (participant.percentage / 100));
        });
    });

    const userDetails = await User.find({ _id: { $in: Object.keys(balanceSheet) } }).select("name email");
    const balanceSheetWithDetails = userDetails.map((user) => ({
        user: user._id,
        name: user.name,
        email: user.email,
        balance: balanceSheet[user._id.toString()],
    }));

    switch (type) {
        case "csv":
            generateCSV(res, balanceSheetWithDetails, next);
            break;
        default:
            res.status(200).json({
                success: true,
                message: "Balance sheet fetched successfully",
                balanceSheet: balanceSheetWithDetails,
            });
    }
});

export {addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, getUserExpenses, getBalanceSheet};
