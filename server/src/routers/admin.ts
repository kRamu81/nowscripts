import express from "express";
import {
  getUsers,
  toggleUserStatus,
  adminResetPassword,
  deleteUser,
  changeUserRole,
  getActivityLogs
} from "../controllers/admin.controller";
import authGuard, { adminGuard, superAdminGuard } from "../middlewares/auth";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authGuard);
router.use(adminGuard);

// Admin Routes
router.get("/users", getUsers);
router.patch("/users/:userId/status", toggleUserStatus);
router.post("/users/:userId/reset-password", adminResetPassword);

import {
  getDashboardStats,
  getLiveUsers,
  getUserGrowth,
  getContentAnalytics,
  getSystemHealth,
  getActivity,
  getRevenue,
  getRecentUsers,
} from "../controllers/admin.analytics.controller";

// Admin Analytics Routes
router.get("/dashboard", getDashboardStats);
router.get("/live-users", getLiveUsers);
router.get("/user-growth", getUserGrowth);
router.get("/content-analytics", getContentAnalytics);
router.get("/system-health", getSystemHealth);
router.get("/activity", getActivity);
router.get("/revenue", getRevenue);
router.get("/recent-users", getRecentUsers);

// Super Admin Routes
router.delete("/users/:userId", superAdminGuard, deleteUser);
router.patch("/users/:userId/role", superAdminGuard, changeUserRole);
router.get("/activity-logs", superAdminGuard, getActivityLogs);

export default router;
