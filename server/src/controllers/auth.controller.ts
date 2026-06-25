import asyncHandler from "express-async-handler";
import axios from "axios";
import User from "../models/user";
import jwt from "jsonwebtoken";
import qs from "qs";
import env from "../utils/envalid";
import Token from "../models/token";
import Session from "../models/session";
import PasswordReset from "../models/password_reset";
import ActivityLog from "../models/activity_log";
import { JWTPayload } from "../middlewares/auth";
import ServerError from "../utils/ServerError";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import { sendOTP } from "../utils/mailer";

// Utility to log activity
const logActivity = async (userId: string | any, action: string, ipAddress?: string, deviceInfo?: string, status: string = 'SUCCESS', details?: string) => {
  try {
    await ActivityLog.create({ userId, action, ipAddress, deviceInfo, status, details });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

const generateTokens = async (userId: string, req: any) => {
  const access_token = jwt.sign({ _id: userId }, env.JWT_SECRET, { expiresIn: "30m" });
  const refresh_token = jwt.sign({ _id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  
  // Save to Session instead of old Token model for new auth, but keep old Token for backward compatibility if needed
  await Session.create({
    userId,
    refreshToken: refresh_token,
    ipAddress: req.ip,
    deviceInfo: req.headers['user-agent'],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  return { access_token, refresh_token };
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ServerError(400, "Please provide all required fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.authProviders.includes("google") && !existingUser.authProviders.includes("password")) {
      res.status(400);
      throw new Error("This email is already registered using Google Sign-In. Please login with Google or use the Forgot Password option to create a password.");
    }
    res.status(400);
    throw new Error("An account with this email already exists. Please login.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProviders: ["password"],
    isVerified: false,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    lists: [{ name: "Reading list", posts: [], images: [] }]
  });

  const { access_token, refresh_token } = await generateTokens(user._id.toString(), req);

  await logActivity(user._id, "REGISTER", req.ip, req.headers['user-agent']);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    access_token,
    refresh_token
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ServerError(400, "Please provide email and password");
  }

  // Special hardcoded admin login check
  if (email === "nowadmin@gmail.com" && password === "now12345") {
     let adminUser = await User.findOne({ email });
     if (!adminUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        adminUser = await User.create({
          name: "Admin",
          email,
          password: hashedPassword,
          authProviders: ["password"],
          isVerified: true,
          role: "Super Admin",
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=Admin`,
          lists: [{ name: "Reading list", posts: [], images: [] }]
        });
     } else {
        // Ensure role is Super Admin and password is correct if user somehow already exists
        adminUser.role = "Super Admin";
        if (!adminUser.authProviders.includes("password")) {
           adminUser.authProviders.push("password");
        }
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(password, salt);
        await adminUser.save();
     }
     
     const { access_token, refresh_token } = await generateTokens(adminUser._id.toString(), req);
     await logActivity(adminUser._id, "LOGIN", req.ip, req.headers['user-agent']);
     
     res.json({
       _id: adminUser._id,
       name: adminUser.name,
       email: adminUser.email,
       role: adminUser.role,
       access_token,
       refresh_token
     });
     return;
  }

  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    throw new ServerError(401, "Invalid email or password");
  }

  if (!user.authProviders.includes("password") || !user.password) {
    throw new ServerError(401, "This account uses Google Sign-In. Please login with Google.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await logActivity(user._id, "LOGIN", req.ip, req.headers['user-agent'], "FAILED", "Incorrect password");
    throw new ServerError(401, "Invalid email or password");
  }

  const { access_token, refresh_token } = await generateTokens(user._id.toString(), req);

  await logActivity(user._id, "LOGIN", req.ip, req.headers['user-agent']);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    access_token,
    refresh_token
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) throw new ServerError(400, "Please provide an email address");

  const user = await User.findOne({ email });
  if (!user) {
    res.status(200).json({ message: "If that email exists, an OTP has been sent." });
    return;
  }

  // Use fixed OTP in development or if SMTP is not configured
  const isDevOrNoSMTP = env.DEV || !env.SMTP_HOST;
  const otp = isDevOrNoSMTP ? "000000" : otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  
  // Save OTP
  await PasswordReset.deleteMany({ email }); // Clear previous
  await PasswordReset.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });

  if (!isDevOrNoSMTP) {
    const sent = await sendOTP(email, user.name, otp);
    if (!sent) {
      throw new ServerError(500, "Email could not be sent. Try again later.");
    }
  }

  await logActivity(user._id, "OTP_REQUEST", req.ip, req.headers['user-agent']);

  res.status(200).json({ message: "Enter the reset code sent to your email." });
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const resetRecord = await PasswordReset.findOne({ email });
  if (!resetRecord) throw new ServerError(400, "OTP expired or invalid");

  if (resetRecord.attempts >= 5) {
    await PasswordReset.deleteOne({ email });
    throw new ServerError(400, "Maximum attempts reached. Please request a new OTP.");
  }

  if (resetRecord.otp !== otp) {
    resetRecord.attempts += 1;
    await resetRecord.save();
    throw new ServerError(400, "Invalid OTP");
  }

  res.json({ message: "OTP verified successfully", token: otp }); // In a real app, generate a temporary reset token instead of passing OTP back
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;

  const resetRecord = await PasswordReset.findOne({ email, otp });
  if (!resetRecord) throw new ServerError(400, "Invalid or expired request");

  const user = await User.findOne({ email });
  if (!user) throw new ServerError(404, "User not found");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  
  if (!user.authProviders.includes("password")) {
    user.authProviders.push("password");
  }
  
  await user.save();
  await PasswordReset.deleteOne({ email });

  // Invalidate all existing sessions
  await Session.deleteMany({ userId: user._id });

  await logActivity(user._id, "PASSWORD_RESET", req.ip, req.headers['user-agent']);

  res.json({ message: "Your password has been successfully reset. You can now login." });
});


export const me = asyncHandler(async (req: any, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) throw new ServerError(404, "User not found");
  
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      list: user.lists,
    }
  });
});

// Legacy / Google Auth Methods
export const tokenRefresh = asyncHandler((req, res, next) => {
  const { token } = req.body;
  const decoded = <JWTPayload>jwt.verify(token, env.JWT_REFRESH_SECRET);
  const access_token = jwt.sign({ _id: decoded._id }, env.JWT_SECRET, {
    expiresIn: "30m",
  });
  res.json({ access_token });
});

export const logout = asyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;
  
  await Token.deleteOne({ token: refresh_token });
  await Session.deleteOne({ refreshToken: refresh_token });
  
  res.json({ message: "logged out succesfully" });
});

export const googleAuth = asyncHandler(async (req, res, next) => {
  const { id_token, access_token } = await getUserFromCode(
    req.query.code as string
  );
  const user = await userDetails(access_token, id_token);
  let isUser: any = await User.findOne({ email: user.email });
  if (!isUser) {
    const temp = new User({
      name: user.name,
      email: user.email,
      authProviders: ["google"],
      isVerified: true,
      avatar:
        user.picture ??
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`,
      lists: [
        {
          name: "Reading list",
          posts: [],
          images: [],
        },
      ],
    });
    isUser = await temp.save();
  } else {
    if (!isUser.authProviders.includes("google")) {
      isUser.authProviders.push("google");
      await isUser.save();
    }
  }

  const access_token_server = jwt.sign({ _id: isUser._id }, env.JWT_SECRET, {
    expiresIn: "30m",
  });
  const refresh_token_server = jwt.sign(
    { _id: isUser._id },
    env.JWT_REFRESH_SECRET
  );
  const refToken = new Token({
    token: refresh_token_server,
  });
  await refToken.save();
  res.redirect(
    `${env.CLIENT_URL}/authredirect?uid=${isUser._id}&access_token=${access_token_server}&refresh_token=${refresh_token_server}`
  );
});

export const googleAuthDirect = asyncHandler(async (req, res, next) => {
  const { access_token } = req.body;
  if (!access_token) {
    return next(new ServerError(400, "Access token missing"));
  }

  const user = await axios
    .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`, error);
      throw new ServerError(401, "Invalid access token");
    });

  let isUser: any = await User.findOne({ email: user.email });
  if (!isUser) {
    const temp = new User({
      name: user.name,
      email: user.email,
      authProviders: ["google"],
      isVerified: true,
      avatar:
        user.picture ??
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`,
      lists: [
        {
          name: "Reading list",
          posts: [],
          images: [],
        },
      ],
    });
    isUser = await temp.save();
  } else {
    if (!isUser.authProviders.includes("google")) {
      isUser.authProviders.push("google");
      await isUser.save();
    }
  }

  const access_token_server = jwt.sign({ _id: isUser._id }, env.JWT_SECRET, {
    expiresIn: "30m",
  });
  const refresh_token_server = jwt.sign(
    { _id: isUser._id },
    env.JWT_REFRESH_SECRET
  );
  const refToken = new Token({
    token: refresh_token_server,
  });
  await refToken.save();
  
  res.json({
    _id: isUser._id,
    name: isUser.name,
    email: isUser.email,
    role: isUser.role,
    avatar: isUser.avatar,
    lists: isUser.lists,
    access_token: access_token_server,
    refresh_token: refresh_token_server
  });
});

async function getUserFromCode(code: string) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: env.clientid,
    client_secret: env.clientsecret,
    redirect_uri: env.redirect_url,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function userDetails(access_token: string, id_token: string) {
  return axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
    });
}
