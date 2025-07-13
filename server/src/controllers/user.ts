import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { ILoginReqBody, NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import bcrypt from "bcrypt";

export const register = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password } = req.body;
    const photo = req.file;

    if (!photo)
      return next(
        new ErrorHandler("Your Image is required for age verification.", 400)
      );

    if (!name || !email || !password)
      return next(new ErrorHandler("Please add all fields", 400));

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      role: "user",
      password: hashedPassword,
      isAdult: true, // TODO:use model to get the value
    });
    return res.status(201).json({
      success: true,
      message: `Welcome, ${newUser.name}`,
    });
  }
);

export const login = TryCatch(
  async (
    req: Request<{}, {}, ILoginReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("User not found", 404));

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 401));

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 401));

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
