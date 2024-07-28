import mongoose from "mongoose";
import {hash} from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide your name"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Provide an email"],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    mobileNumber: {
        type: String,
        unique: true,
        required: [true, "Provide mobile number"],
        trim: true,
        minlength: 10,
        maxlength: 15
    },
    password: {
        type: String,
        required: [true, "Provide a password"],
        select: false
    },
    avatar: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await hash(this.password, 10);
    next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
