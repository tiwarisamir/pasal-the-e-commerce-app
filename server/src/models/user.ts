import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  name: string;
  email: string;
  role: "admin" | "user";
  isAdult: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email Already Exist"],
      required: [true, "Please Enter Email"],
      validate: validator.default.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isAdult: {
      type: Boolean,
      required: [true, "Please verify you are adult"],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", schema);
