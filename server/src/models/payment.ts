import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      ref: "Order",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", schema);
