import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from "./utils/features.js";
import {sout} from "./utils/utility.js";
import {clientUrl, dbName, dbUrl, envMode, PORT} from "./utils/constants.js";
import cookieParser from "cookie-parser";
import {errorMiddleware} from "./middlewares/error.middleware.js";

dotenv.config({path: "./.env"});

const corsOptions = {
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}; sout("CORs Options: ", corsOptions);


connectDB(dbUrl, dbName);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    sout(`Route being hit: ${req.method} ${req.path}`);
    next();
});

app.use("/api/v1/users", userRoutes); // User Endpoints
app.use("/api/v1/expenses", expenseRoutes); // Expense Endpoints

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running in ${envMode} mode on port ${PORT}`);
    sout("Client URL: ", clientUrl);
    sout("DB URL: ", dbUrl);
    sout("DB Name: ", dbName);
});