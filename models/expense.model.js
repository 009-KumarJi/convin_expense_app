// models/Expense.js

import mongoose, { model } from "mongoose";

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
                },
                percentage: {
                    type: Number,
                    validate: {
                        validator: function (v) {
                            return this.splitMethod !== "percentage" || v > 0;
                        },
                        message: "Percentage must be greater than 0",
                    },
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

export const Expense = mongoose.models.Expense || model("Expense", expenseSchema);


// server/models/expense.model.js