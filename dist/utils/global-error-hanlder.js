"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error,
    });
};
const prodErrors = (res, error) => {
    if (error.isOperational) {
        res
            .status(error.statusCode)
            .json({ status: error.status, message: error.message });
    }
    else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong! Please try again later.",
        });
    }
};
exports.default = (error, req, res, next) => {
    console.error(error);
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV === "development") {
        devErrors(res, error);
    }
    else if (process.env.NODE_ENV === "production") {
        prodErrors(res, error);
    }
};
