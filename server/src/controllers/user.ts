import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { ILoginReqBody, NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/features.js";
import FormData from "form-data";
import axios from "axios";

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

    const form = new FormData();
    form.append("file", photo.buffer, {
      filename: photo.originalname,
      contentType: photo.mimetype,
    });
    const response = await axios.post(
      `${process.env.AGE_VERIFICATION_URI!}/predict`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    if (!response.data.is_adult) {
      return next(
        new ErrorHandler(
          "Your age is less than 21 so you cannot sign up in this site",
          403
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      role: "user",
      password: hashedPassword,
      isAdult: response.data.is_adult,
    });
    const token = createToken(newUser._id.toString());
    return res.status(201).json({
      success: true,
      message: `Welcome, ${newUser.name}`,
      data: {
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isAdult: newUser.isAdult,
        },
      },
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

    let user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("User not found", 404));

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const token = createToken(user._id.toString());
    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}`,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isAdult: user.isAdult,
        },
      },
    });
  }
);

export const logout = TryCatch(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const { _id: id } = req.user!;
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

export const checkModelHealth = TryCatch(async (req, res, next) => {
  const response = await axios.get(
    `${process.env.AGE_VERIFICATION_URI!}/health`
  );

  return res.status(200).json({
    success: true,
    message: "Health Check completed",
    data: response.data,
  });
});
