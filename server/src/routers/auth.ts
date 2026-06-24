import express from "express";
import {
  googleAuth,
  logout,
  tokenRefresh,
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controller";
import { loginLimiter, forgotPasswordLimiter, otpVerifyLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-otp", otpVerifyLimiter, verifyOTP);
router.post("/reset-password", resetPassword);

router.route("/google/oauth").get(googleAuth);
router.route("/logout").post(logout);
router.route("/token").post(tokenRefresh);

export default router;
