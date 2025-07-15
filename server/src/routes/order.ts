import express from "express";

import { adminOnly, isAuth } from "../middlewares/auth.js";
import {
  allOrder,
  deleteOrder,
  myOrder,
  newOrder,
  pay,
  processOrder,
} from "../controllers/order.js";
import { getSingleOrder } from "../controllers/order.js";

const app = express.Router();

app.post("/new", isAuth, newOrder);
app.post("/pay", isAuth, pay);

app.get("/my", isAuth, myOrder);

app.get("/all", adminOnly, allOrder);

app
  .route("/:id")
  .get(isAuth, getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
