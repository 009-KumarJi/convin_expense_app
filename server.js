// server.js

import express from "express";
import cors from "cors";
import {connectDB} from "./utils/features.js";
import {sout} from "./utils/utility.js";
import {clientUrl, dbName, dbUrl, envMode, PORT, printAll} from "./utils/constants.js";
import cookieParser from "cookie-parser";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import {getBalanceSheet} from "./controllers/expense.controller.js";

const corsOptions = {
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}; sout("CORs Options: ", corsOptions);

printAll();

connectDB(dbUrl, dbName);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    sout(`Route being hit: ${req.method} ${req.path}`);
    next();
});

app.use("/api/users", userRoutes); // User Endpoints
app.use("/api/expenses", expensesRoutes); // Expenses Endpoints
app.use("/api/balance-sheet", getBalanceSheet); // download balance-sheet


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running in ${envMode} mode on port ${PORT}`);
    sout("Client URL: ", clientUrl);
    sout("DB URL: ", dbUrl);
    sout("DB Name: ", dbName);
});