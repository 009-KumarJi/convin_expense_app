// models/User.js

import mongoose from "mongoose";
import { hash } from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Your name"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Provide a Username!"]
    },
    email: {
        type: String,
        required: [true, "Provide email!"],
        unique: true,
        trim: true,
        lowercase: true
    },
    dob: {
        type: Date,
        required: [true, "Provide Date of Birth!"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            trim: true,
        },
        url: {
            type: String,
            trim: true
        },
    },
    expenseId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense"
    }]
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await hash(this.password, 10);
    next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
