const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = `${err.keyValue.name}`;
  const message = `Duplicate field value: ${value} please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid Token. Please log in again ", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Session Expired. PLease log in again", 401);
};

const sendErrorDev = (err, req, res) => {
  //API
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  //API

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error("ERROR: ", err);
    return res.status(500).json({
      status: "error",
      message: "Something Went Wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  console.log(err.stack, err, "ERROR");
  // if (error.name === "CastError") {
  //   error = handleCastErrorDB(error);
  // }

  // if (error.code === 11000) {
  //   error = handleDuplicateFieldsDB(error);
  // }

  // if (error.message === 'Validation failed') {
  //   error = handleValidationErrorDB(error);
  // }

  // if (error.name === "JsonWebTokenError") {
  //   error = handleJWTError();
  // }

  // if (error.name === "TokenExpiredError") {
  //   error = handleJWTExpiredError();
  // }
  sendErrorProd(error, req, res);
};
