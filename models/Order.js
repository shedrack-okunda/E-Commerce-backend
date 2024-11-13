import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: [Schema.Types.Mixed], required: true },
    address: { type: [Schema.Types.Mixed], required: true },
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Out for delivery", "Cancelled"],
      default: "Pending",
    },
    paymentMode: {
      type: String,
      enum: ["MPESA", "COD", "UPI", "CARD"],
      required: true,
    },
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
