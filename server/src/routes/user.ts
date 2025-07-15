import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  login,
  register,
} from "../controllers/user.js";
import { adminOnly, isAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/register", singleUpload, register);
app.post("/login", login);
app.get("/all", adminOnly, getAllUsers);

app.route("/:id").get(isAuth, getUser).delete(adminOnly, deleteUser);

export default app;
