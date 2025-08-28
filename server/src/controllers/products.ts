import { faker } from "@faker-js/faker";
import { Request } from "express";
import { rm } from "fs";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import {
  BaseQuery,
  IJwtPayload,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import {
  invalidateCache,
  uploadFileToCloudinary,
  verifyToken,
} from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
import { Order } from "../models/order.js";
import { Types } from "mongoose";

interface MulterRequest<B = any> extends Request<{}, {}, B> {
  file?: Express.Multer.File;
}

export const newProduct = TryCatch(
  async (req: MulterRequest<NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please Add Photo", 400));

    const result = await uploadFileToCloudinary(photo);

    if (!name || !price || !stock || !category) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: result.url,
    });

    invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const getRecommendedProducts = TryCatch(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new ErrorHandler("Please Login First", 401));

  const userId = verifyToken(token);

  let categories: string[] = [];

  if (userId) {
    const orders = await Order.find({ user: userId }).populate(
      "orderItems.productId"
    );

    const categoryCounts: Record<string, number> = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item: any) => {
        const cat = item.productId?.category;
        if (cat) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
        }
      });
    });

    categories = Object.keys(categoryCounts).sort(
      (a, b) => categoryCounts[b] - categoryCounts[a]
    );
  }

  if (categories.length === 0) {
    const randomProductArr = await Product.aggregate([
      { $sample: { size: 3 } },
    ]);

    if (randomProductArr.length > 0) {
      categories = [...new Set(randomProductArr.map((p) => p.category))];
    }
  }

  if (categories.length === 0)
    return res.status(200).json({
      success: true,
      products: [],
    });

  const recommendations = await Product.find({
    category: { $in: categories },
  })
    .limit(8)
    .exec();

  return res.status(200).json({
    success: true,
    products: recommendations,
  });
});

export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-product"))
    products = JSON.parse(myCache.get("latest-product") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(12);

    myCache.set("latest-product", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");

    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let allProducts;

  if (myCache.has("allProducts"))
    allProducts = JSON.parse(myCache.get("allProducts") as string);
  else {
    allProducts = await Product.find({});

    myCache.set("allProducts", JSON.stringify(allProducts));
  }

  return res.status(200).json({
    success: true,
    products: allProducts,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  let product;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  rm(product.photo!, () => {
    console.log("Product Photo Deleted");
  });

  await product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 9;

    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    if (category) baseQuery.category = category;

    const [products, filteredOnlyProduct] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
