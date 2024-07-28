import { TryCatch } from "../middlewares/error.middleware.js";
import { ErrorHandler, sout } from "../utils/utility.js";
import { User } from "../models/user.model.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { compare } from "bcrypt";
import {avatarUrl, sessionId} from "../utils/constants.js";

const register = TryCatch(async (req, res) => {
    const { name, email, mobileNumber, password, gender } = req.body;

    sout(req.body);

    const user = await User.create({
        name,
        email,
        mobileNumber,
        password,
        gender,
        avatar: avatarUrl(gender)
    });

    sendToken(res, user, 201, "User Created Successfully!");
});

const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid credentials", 401));

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return next(new ErrorHandler("Invalid credentials", 401));

    sendToken(res, user, 200, `User Login Successful for ${user.name}!`);
});

const getMyProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.userId).select("-password");

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user,
    });
});

const logout = TryCatch(async (req, res) => {
    return res.status(200)
        .cookie(sessionId, "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});

export { register, login, getMyProfile, logout };
