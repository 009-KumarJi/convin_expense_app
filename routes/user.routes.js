import express from "express";
import {loginValidator, registerValidator, validateHandler} from "../utils/validators.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/register", registerValidator(), validateHandler, register);
app.post("/login", loginValidator(), validateHandler, login);

app.use(isAuthenticated);

app.get("/profile", getMyProfile);
app.get("/logout", logout);