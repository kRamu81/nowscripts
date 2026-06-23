import { Request, Response, NextFunction } from "express";
import env from "../utils/envalid";
import ServerError from "../utils/ServerError";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { JWTPayload } from "./auth";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const AuthToken = req.headers["authorization"]?.split(" ")[1];
    if (!AuthToken) throw new ServerError(401, "Unauthorised");
    
    const decoded = <JWTPayload>jwt.verify(AuthToken, env.JWT_SECRET);
    req.userId = decoded._id;

    // Fetch user to check role
    const user = await User.findById(req.userId);
    if (!user) throw new ServerError(401, "User not found");
    if (user.role !== "Admin") {
      throw new ServerError(403, "Forbidden: Admin access required");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isAdmin;
