import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Max 100 requests/IP
    standardHeaders: true, // Send RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Max 5 requests/IP
    standardHeaders: true, // Send RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers

    message: {
        success: false,
        message: "Too many attempts. Please try again later."
    }
});