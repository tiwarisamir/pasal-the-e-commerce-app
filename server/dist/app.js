import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
dotenv.config({
    path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
connectDB(mongoURI);
const app = express();
app.use(express.json());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.get("/", (req, res) => {
    res.send("Hello there");
});
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
});
