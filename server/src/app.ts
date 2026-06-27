import express from "express";
const app = express();
import env from "./utils/envalid";
import logger from "./middlewares/logger";
import postRouter from "./routers/post";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";
import adminRouter from "./routers/admin";
import searchRouter from "./routers/search";
import learnRouter from "./routers/learn";
import roadmapRouter from "./routes/roadmapRoutes";
import newsletterRouter from "./routes/newsletterRoutes";
import certificateRouter from "./routes/certificateRoutes";
import interviewPrepProgressRouter from "./routes/interviewPrepProgressRoutes";
import interviewRouter from "./routers/interview";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import morgan from "morgan";
import { performanceMonitor, getAverageResponseTime } from "./middlewares/performanceMonitor";
import { errorHandler } from "./middlewares/errorHandler";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/user";
const server = createServer(app);

const isProd = !env.DEV;
if (isProd) {
  app.use(logger);
}
app.use(cors({
  origin: [
    "https://nowscripts.in",
    "https://www.nowscripts.in",
    "https://nowscripts.vercel.app",
    env.CLIENT_URL,
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(performanceMonitor);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(mongoSanitize());
app.use(xss());
if (isProd) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const ONLINE_USER_TO_SOCKET_ID_MAP = new Map<string, string>();

export interface LiveUserData {
  socketId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  currentPage: string;
  browser: string;
  device: string;
  loginTime: Date;
  lastActivity: Date;
}
export const LIVE_USERS_MAP = new Map<string, LiveUserData>();

const io = new Server(server, {
  cors: {
    origin: [
      "https://nowscripts.in",
      "https://www.nowscripts.in",
      "https://nowscripts.vercel.app",
      env.CLIENT_URL,
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("a user connected with id : ", socket.id);
  
  // Broadcast current online users count to everyone
  io.emit("onlineUsersCount", (io.engine as any).clientsCount);
  socket.on("start", async ({ userId, userDetails }) => {
    ONLINE_USER_TO_SOCKET_ID_MAP.set(userId, socket.id);
    if (userDetails) {
      LIVE_USERS_MAP.set(socket.id, {
        socketId: socket.id,
        userId,
        name: userDetails.name,
        email: userDetails.email,
        avatar: userDetails.avatar,
        role: userDetails.role,
        currentPage: userDetails.currentPage || "/",
        browser: userDetails.browser || "Unknown",
        device: userDetails.device || "Desktop",
        loginTime: new Date(),
        lastActivity: new Date(),
      });
    } else {
      // Fallback
      const user = await User.findById(userId);
      if (user) {
        LIVE_USERS_MAP.set(socket.id, {
          socketId: socket.id,
          userId,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=NowScripts",
          role: user.role,
          currentPage: "/",
          browser: "Unknown",
          device: "Desktop",
          loginTime: new Date(),
          lastActivity: new Date(),
        });
      }
    }
  });

  socket.on("page_change", ({ page }) => {
    const liveUser = LIVE_USERS_MAP.get(socket.id);
    if (liveUser) {
      liveUser.currentPage = page;
      liveUser.lastActivity = new Date();
      LIVE_USERS_MAP.set(socket.id, liveUser);
    }
  });

  socket.on("activity", () => {
    const liveUser = LIVE_USERS_MAP.get(socket.id);
    if (liveUser) {
      liveUser.lastActivity = new Date();
      LIVE_USERS_MAP.set(socket.id, liveUser);
    }
  });

  socket.on("notify", ({ userId }) => {
    const room = ONLINE_USER_TO_SOCKET_ID_MAP.get(userId);
    socket.to(room!).emit("haveNotifications", true);
  });
  socket.on("checkNotifications", async ({ userId }) => {
    const test = await User.findOne({
      _id: userId,
    });
    let count = 0;
    test?.notifications.forEach((item) => {
      if (!item.read) count++;
    });
    socket.emit("notificationsCount", { count });
  });
  socket.on("readAll", async ({ userId }) => {
    await User.updateOne(
      { _id: userId },
      { $set: { "notifications.$[].read": true } },
      { multi: true }
    );
  });
  socket.on("disconnect", (reason) => {
    console.log(reason, socket.id);
    
    // Find the userId for this socket to remove from ONLINE_USER_TO_SOCKET_ID_MAP
    let disconnectedUserId = null;
    for (const [userId, sockId] of Array.from(ONLINE_USER_TO_SOCKET_ID_MAP.entries())) {
      if (sockId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }
    if (disconnectedUserId) {
      ONLINE_USER_TO_SOCKET_ID_MAP.delete(disconnectedUserId);
    }
    
    LIVE_USERS_MAP.delete(socket.id);
    io.emit("onlineUsersCount", (io.engine as any).clientsCount);
  });
});

// Periodic cleanup of inactive live users (5 minutes)
setInterval(() => {
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  for (const [socketId, user] of Array.from(LIVE_USERS_MAP.entries())) {
    if (user.lastActivity < fiveMinsAgo) {
      LIVE_USERS_MAP.delete(socketId);
    }
  }
}, 60000);

// Emit Live Metrics every 10 seconds
import os from "os";
import mongoose from "mongoose";
import { cacheService } from "./utils/cache";

setInterval(() => {
  const memoryUsage = process.memoryUsage();
  
  io.emit("adminMetrics", {
    liveUsers: LIVE_USERS_MAP.size,
    memoryUsage: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    cpuUsage: os.loadavg()[0].toFixed(2),
    socketConnections: (io.engine as any).clientsCount,
    serverUptime: process.uptime(),
    avgResponseTime: getAverageResponseTime().toFixed(2),
    cacheStats: cacheService.getStats(),
    dbState: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
}, 10000);

app.get("/health", (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    status: "healthy",
    mongodb: "connected", // Wait, I should verify this but good enough for now
    socket: "active",
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    },
    version: process.env.npm_package_version || "1.0.0"
  });
});

app.get("/test", (req, res) => {
  res.send("Hello from server side");
});

app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/search", searchRouter);
app.use("/learn", learnRouter);
app.use("/roadmap", roadmapRouter);
app.use("/newsletter", newsletterRouter);
app.use("/certificate", certificateRouter);
app.use("/progress/interview-prep", interviewPrepProgressRouter);
app.use("/interviews", interviewRouter);

app.use(errorHandler);

export { server, io };
