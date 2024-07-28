import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, "Provide a description for the expense"],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, "Provide the total amount for the expense"],
        min: [0, "Amount must be greater than or equal to 0"]
    },
    splitMethod: {
        type: String,
        enum: ["equal", "exact", "percentage"],
        required: [true, "Provide a split method for the expense"]
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Provide a user ID for the participant"]
        },
        amount: {
            type: Number,
            min: [0, "Amount must be greater than or equal to 0"],
            validate: {
                validator: function (v) {
                    return this.parent().splitMethod === 'exact' || v === undefined;
                },
                message: "Amount should only be provided for 'exact' split method"
            }
        },
        percentage: {
            type: Number,
            min: [0, "Percentage must be greater than or equal to 0"],
            max: [100, "Percentage must be less than or equal to 100"],
            validate: {
                validator: function (v) {
                    return this.parent().splitMethod === 'percentage' || v === undefined;
                },
                message: "Percentage should only be provided for 'percentage' split method"
            }
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Provide the user ID of the creator"]
    }
}, {
    timestamps: true
});

expenseSchema.pre('save', function(next) {
    if (this.splitMethod === 'percentage') {
        const totalPercentage = this.participants.reduce((sum, participant) => sum + (participant.percentage || 0), 0);
        if (totalPercentage !== 100) {
            return next(new Error('Total percentage must add up to 100%'));
        }
    }
    next();
});

export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
