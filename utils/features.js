import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {sessionId} from "./constants.js";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "none",
    secure: true,
};

const connectDB = (uri, dbName) => {
    console.log("Attempting to connect to database...");
    mongoose.connect(uri, {
        dbName,
    })
        .then((data) => {
            console.log(`Successfully connected to the database at host: ${data.connection.host}`);
        })
        .catch((err) => {
            throw new Error(err);
        });
}

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    return res
        .status(code)
        .cookie(sessionId, token, cookieOptions)
        .json({
            success: true,
            user,
            message
        });
};


export {connectDB, sendToken};