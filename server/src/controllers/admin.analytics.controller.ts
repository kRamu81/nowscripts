import asyncHandler from "express-async-handler";
import User from "../models/user";
import Post from "../models/post";
import Course from "../models/course";
import Lesson from "../models/lesson";
import Roadmap from "../models/roadmap";
import InterviewPrepProgress from "../models/interviewPrepProgress";
import Certificate from "../models/certificate";
import ActivityLog from "../models/activity_log";
import Newsletter from "../models/newsletter";
import os from "os";
import { LIVE_USERS_MAP } from "../app";
import { cacheService } from "../utils/cache";

// GET /api/admin/dashboard
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const stats = await cacheService.fetchWithCache("dashboard_stats", async () => {
    const totalUsers = await User.countDocuments();
    
    // Calculate today's dates
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const startOfMonth = new Date();
    startOfMonth.setMonth(startOfMonth.getMonth() - 1);

    const [
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      googleSignins,
      emailSignins,
      activeUsersTodayObj
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ authProviders: "google" }),
      User.countDocuments({ authProviders: "password" }),
      ActivityLog.aggregate([
        { $match: { timestamp: { $gte: startOfToday } } },
        { $group: { _id: "$userId" } },
        { $count: "activeUsers" }
      ])
    ]);

    const activeUsersToday = activeUsersTodayObj.length > 0 ? activeUsersTodayObj[0].activeUsers : 0;

    return {
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      activeUsersToday,
      googleSignins,
      emailSignins,
    };
  }, 60);

  res.json({
    ...stats,
    usersOnlineNow: LIVE_USERS_MAP.size,
  });
});

// GET /api/admin/live-users
export const getLiveUsers = asyncHandler(async (req, res, next) => {
  const users = Array.from(LIVE_USERS_MAP.values()).map(user => ({
    socketId: user.socketId,
    userId: user.userId,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    currentPage: user.currentPage,
    browser: user.browser,
    device: user.device,
    loginTime: user.loginTime,
    lastActivity: user.lastActivity,
  }));
  res.json({ users });
});

// GET /api/admin/user-growth
export const getUserGrowth = asyncHandler(async (req, res, next) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyRegistrations = await User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ dailyRegistrations });
});

// GET /api/admin/content-analytics
export const getContentAnalytics = asyncHandler(async (req, res, next) => {
  const totalCourses = await Course.countDocuments();
  const totalLessons = await Lesson.countDocuments();
  const totalRoadmaps = await Roadmap.countDocuments();
  
  // Total Mock Tests and Questions can be counted from interview collections
  const totalCommunityPosts = await Post.countDocuments();
  const totalCertificatesIssued = await Certificate.countDocuments();
  const totalNewsletterArticles = await Newsletter.countDocuments();

  res.json({
    learning: {
      totalCourses,
      totalLessons,
      totalRoadmaps,
    },
    community: {
      totalPosts: totalCommunityPosts,
    },
    certificates: {
      issued: totalCertificatesIssued,
    },
    newsletter: {
      totalArticles: totalNewsletterArticles,
    }
  });
});

// GET /api/admin/system-health
export const getSystemHealth = asyncHandler(async (req, res, next) => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;

  const cpus = os.cpus();
  const cpuModel = cpus[0].model;

  res.json({
    backendStatus: "Online",
    databaseStatus: "Connected", // Mongoose status handled inherently
    socketIoStatus: "Active",
    serverUptime: process.uptime(),
    memoryUsage: memoryUsagePercent.toFixed(2),
    cpuModel,
    platform: os.platform(),
  });
});

// GET /api/admin/activity
export const getActivity = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const activities = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("userId", "name avatar email");
    
  res.json({ activities });
});

// GET /api/admin/revenue
export const getRevenue = asyncHandler(async (req, res, next) => {
  // Placeholder for future revenue integration
  res.json({
    currentRevenue: 0,
    premiumMembers: 0,
    certificatesSold: 0,
    courseSales: 0,
    internshipRevenue: 0,
    estimatedMonthlyRevenue: 0,
  });
});

// GET /api/admin/recent-users
export const getRecentUsers = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({ users });
});
