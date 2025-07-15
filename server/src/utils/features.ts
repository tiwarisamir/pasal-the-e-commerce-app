import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import mongoose, { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import jwt from "jsonwebtoken";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI as string, {
      dbName: "Pasal",
    })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKey: string[] = [
      "latest-product",
      "categories",
      "allProducts",
    ];

    if (typeof productId === "string") productKey.push(`product-${productId}`);

    if (typeof productId === "object")
      productId.forEach((i) => productKey.push(`product-${i}`));

    myCache.del(productKey);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];

    const product = await Product.findById(order.productId);

    if (!product) throw new Error("Product Not Found");

    product.stock -= order.quantity;

    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;

  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};

interface myDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}

type funcProps = {
  length: number;
  docArr: myDocument[];
  today: Date;
  property?: "discount" | "total";
};

interface FileResult {
  public_id: string;
  url: string;
}

export const getBase64 = (file: Express.Multer.File) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const uploadFileToCloudinary = async (
  file: Express.Multer.File
): Promise<FileResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      getBase64(file),
      {
        resource_type: "auto",
        public_id: uuid(),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result!.public_id,
          url: result!.secure_url,
        });
      }
    );
  });
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: funcProps) => {
  const data = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property]! : 1;
    }
  });
  return data;
};

export const createSignature = (message: string) => {
  const hmac = crypto.createHmac("sha256", "8gBm/:&EnhH.1/q");
  hmac.update(message);

  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

export const createToken = (id: string) => {
  const token = jwt.sign({ _id: id }, process.env.JWT_SCRET as string, {
    expiresIn: "1d",
  });
  return token;
};
