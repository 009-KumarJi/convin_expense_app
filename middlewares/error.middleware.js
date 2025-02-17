import {sout} from "../utils/utility.js";
import {envMode} from "../utils/constants.js";

const errorMiddleware = (err, req, res, next) => {
  sout("Error: ", err);
  err.message ||= "Internal server err";
  err.statusCode ||= 500;
  if (err.code === 11000) {
    err.message = `Duplicate Field Value: ${(Object.keys(err.keyValue)).join(", ")}!`;
    err.statusCode = 409;
  }
  if (err.name === "CastError") {
    err.message = `Resource not found. Invalid: ${err.path.toString().replace("_", "").toUpperCase()}`;
    err.statusCode = 404;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errorName: err.name,
    ...(envMode === "DEVELOPMENT" && {error: err})
  });
};

const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};

export {errorMiddleware, TryCatch};

// Path: server/middlewares/error.middleware.js