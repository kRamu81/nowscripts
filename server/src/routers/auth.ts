import express from "express";
import {
  googleAuth,
  googleAuthDirect,
  logout,
  tokenRefresh,
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  me,
} from "../controllers/auth.controller";
import { loginLimiter, forgotPasswordLimiter, otpVerifyLimiter } from "../middlewares/rateLimiter";
import isAuthenticated from "../middlewares/auth";

const router = express.Router();

router.get("/me", isAuthenticated, me);

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/verify-otp", otpVerifyLimiter, verifyOTP);
router.post("/reset-password", resetPassword);

router.route("/google/oauth").get(googleAuth);
router.post("/google/direct", googleAuthDirect);
router.route("/logout").post(logout);
router.route("/token").post(tokenRefresh);

export default router;
