import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  allOrder,
  deleteOrder,
  myOrder,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { getSingleOrder } from "../controllers/order.js";

const app = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrder);

app.get("/all", adminOnly, allOrder);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
