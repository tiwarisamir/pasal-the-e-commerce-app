import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI as string, {
      dbName: "Pasal",
    })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({
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

  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return Number(percent.toFixed(0));
};
