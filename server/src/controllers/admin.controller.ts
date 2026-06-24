import asyncHandler from "express-async-handler";
import User from "../models/user";
import ActivityLog from "../models/activity_log";
import ServerError from "../utils/ServerError";
import bcrypt from "bcryptjs";
import Session from "../models/session";

// Admin: Get all users with search and pagination
export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.json({
    users,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// Admin: Disable/Enable user accounts
export const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ServerError(404, "User not found");

  if (user.role === "Super Admin") {
    throw new ServerError(403, "Cannot modify Super Admin accounts");
  }

  user.isActive = isActive;
  await user.save();

  if (!isActive) {
    await Session.deleteMany({ userId: user._id }); // Invalidate all sessions if disabled
  }

  res.json({ message: `User account ${isActive ? "enabled" : "disabled"} successfully` });
});

// Admin: Force reset user password
export const adminResetPassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    throw new ServerError(400, "Password must be at least 8 characters");
  }

  const user = await User.findById(userId);
  if (!user) throw new ServerError(404, "User not found");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  if (!user.authProviders.includes("password")) {
    user.authProviders.push("password");
  }

  await user.save();
  await Session.deleteMany({ userId: user._id }); // Invalidate old sessions

  res.json({ message: "Password reset successfully" });
});

// Super Admin: Delete user permanently
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ServerError(404, "User not found");

  if (user.role === "Super Admin") {
    throw new ServerError(403, "Cannot delete Super Admin accounts");
  }

  await User.findByIdAndDelete(userId);
  await Session.deleteMany({ userId });
  await ActivityLog.deleteMany({ userId });

  res.json({ message: "User deleted successfully" });
});

// Super Admin: Change user role
export const changeUserRole = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["Admin", "user"].includes(role)) {
    throw new ServerError(400, "Invalid role");
  }

  const user = await User.findById(userId);
  if (!user) throw new ServerError(404, "User not found");

  if (user.role === "Super Admin") {
    throw new ServerError(403, "Cannot change role of Super Admin");
  }

  user.role = role;
  await user.save();

  res.json({ message: "User role updated successfully", role: user.role });
});

// Super Admin: View activity logs
export const getActivityLogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const logs = await ActivityLog.find()
    .populate("userId", "name email avatar")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await ActivityLog.countDocuments();

  res.json({
    logs,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});
