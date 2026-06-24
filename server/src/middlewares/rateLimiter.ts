import rateLimit from "express-rate-limit";

// Login: 5 attempts / 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot Password: 3 requests / hour
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many password reset requests from this IP, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP Verify: 5 attempts / 10 minutes
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP verification attempts, please try again after 10 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
