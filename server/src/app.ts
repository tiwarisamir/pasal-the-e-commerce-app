import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";

import { Product } from "./models/products.js";
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

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});

const storeIntegerPrice = async (productId: any) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (typeof product.price !== "number") {
      throw new Error("Product price is not a number");
    }
    let integerPrice = product.price;
    if (product.price > 1000) {
      integerPrice = Math.floor(product.price / 10); // Get the integer part
    }

    product.price = integerPrice; // Update the product's price

    await product.save(); // Save the updated product

    console.log(`Product price updated to integer: ${integerPrice}`);
    return integerPrice; // Optionally return the updated price
  } catch (error) {
    console.error("Error storing integer price:", error);
    throw error; // Re-throw the error for handling elsewhere
  }
};

const updateAllProductPrices = async () => {
  try {
    const allProducts = await Product.find({});
    for (const product of allProducts) {
      await storeIntegerPrice(product._id);
    }
    console.log("All product prices updated to integers.");
  } catch (err) {
    console.error("error updating all products:", err);
    throw err;
  }
};

// updateAllProductPrices();
