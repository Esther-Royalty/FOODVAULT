import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors;

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(err.errors).map((error) => error.message);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
        errors = [`${Object.keys(err.keyValue)[0]} already exists`];
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorHandler;
