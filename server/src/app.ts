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
import cors from "cors";
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const ONLINE_USER_TO_SOCKET_ID_MAP = new Map<string, string>();

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
  socket.on("start", ({ userId }) => {
    ONLINE_USER_TO_SOCKET_ID_MAP.set(userId, socket.id);
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
    io.emit("onlineUsersCount", (io.engine as any).clientsCount);
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

app.use(errorHandler);

export { server, io };
