import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: [true, "Provide a description for the expense"],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, "Provide the total amount for the expense"],
            min: [0, "Amount must be greater than or equal to 0"],
        },
        splitMethod: {
            type: String,
            enum: ["equal", "exact", "percentage"],
            required: [true, "Provide a split method for the expense"],
        },
        participants: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: [true, "Provide a user ID for the participant"],
                },
                amount: {
                    type: Number,
                    required: [true, "Provide the amount for the participant"],
                    min: [0, "Amount must be greater than or equal to 0"],
                },
                percentage: {
                    type: Number,
                    min: [0, "Percentage must be greater than or equal to 0"],
                    max: [100, "Percentage must be less than or equal to 100"],
                },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Provide the user ID of the creator"],
        },
    },
    {
        timestamps: true,
    }
);

export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

// server/models/expense.model.js