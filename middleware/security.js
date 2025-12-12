import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Configure Helmet for secure HTTP headers
export const configureSecurityHeaders = () => {
    return helmet();
};

// Configure Rate Limiter
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});
