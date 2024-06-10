import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";

import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/products.js";
import dashboardRoute from "./routes/stats.js";
import userRoute from "./routes/user.js";

config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
