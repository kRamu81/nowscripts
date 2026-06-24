import { Request, Response, NextFunction } from "express";
import env from "../utils/envalid";
import ServerError from "../utils/ServerError";
import jwt from "jsonwebtoken";
import User from "../models/user";

export interface JWTPayload {
  _id: string;
  iat: number;
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const AuthToken = req.headers["authorization"]?.split(" ")[1];
  if (!AuthToken) throw new ServerError(401, "Unauthorised");
  const decoded = <JWTPayload>jwt.verify(AuthToken, env.JWT_SECRET);
  req.userId = decoded._id;
  next();
};

export const adminGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || (user.role !== "Admin" && user.role !== "Super Admin")) {
      throw new ServerError(403, "Admin access required");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const superAdminGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "Super Admin") {
      throw new ServerError(403, "Super Admin access required");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
