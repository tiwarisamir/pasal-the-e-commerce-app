import { User } from "../models/user.js";
import { IJwtPayload } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

export const adminOnly = TryCatch(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new ErrorHandler("Please Login First", 401));

  const decoded = jwt.verify(token, process.env.JWT_SCRET!) as IJwtPayload;
  req.user = decoded;

  const user = await User.findById(decoded._id);

  if (!user) return next(new ErrorHandler("User not Found", 404));

  if (user.role !== "admin")
    return next(
      new ErrorHandler("You are not allowed to access this route", 403)
    );

  next();
});

export const isAuth = TryCatch(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new ErrorHandler("Please Login First", 401));

  const decoded = jwt.verify(token, process.env.JWT_SCRET!) as IJwtPayload;
  req.user = decoded;

  next();
});
