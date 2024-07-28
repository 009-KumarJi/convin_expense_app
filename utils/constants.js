// utils/constants.js

import {sout} from "./utility.js";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

const envMode = process.env.NODE_ENV || "PRODUCTION";
const dbName = process.env.DB_NAME;
const dbUrl = process.env.MONGO_URI;
const clientUrl = process.env.CLIENT_URL;
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const sessionId = "sessionId";
const avatarUrl = (gender = "male") => {
    const avatarNames = {
        male: ["Cali", "Mittens", "Boo", "Chester", "Tiger", "Jack", "Bandit", "Misty", "Patches", "Sophie"],
        female: ["Casper", "Princess", "Miss%20kitty", "Sammy", "Bear", "Zoey", "Peanut", "Bella", "Buster", "Lucky"]
    };
    if (!avatarNames[gender]) gender = "male";
    const randomName = avatarNames[gender][Math.floor(Math.random() * 10)];
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomName}`;
};

const printAll = () => {
    sout({
        "EnvMode": envMode,
        "dbName": dbName,
        "dbUrl": dbUrl,
        "clientUrl": clientUrl,
        jwtSecret,
        PORT,
        sessionId
    })
}

export {envMode, dbName, dbUrl, clientUrl, jwtSecret, PORT, sessionId, avatarUrl, printAll};