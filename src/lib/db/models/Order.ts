import mongoose, { Document, Schema } from "mongoose";
import { DeliveryMethod } from "./Product";

export type OrderStatus = "pending" | "paid" | "delivered" | "failed" | "refunded";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    product: mongoose.Types.ObjectId;
    planIndex: number;
    quantity: number;
    price: number;
    delivery: DeliveryMethod;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryInfo?: {
    method: DeliveryMethod;
    credentials?: Record<string, string>;
    notes?: string;
  };
  paymentMethod: string;
  paymentReference?: string;
  isPaid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  planIndex: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  delivery: {
    type: String,
    enum: ["manual", "stock", "api", "upgrade", "gift_code", "scheduled"],
    default: "manual",
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "delivered", "failed", "refunded"],
      default: "pending",
    },
    deliveryInfo: {
      method: {
        type: String,
        enum: ["manual", "stock", "api", "upgrade", "gift_code", "scheduled"],
      },
      credentials: { type: Schema.Types.Mixed },
      notes: { type: String },
    },
    paymentMethod: { type: String, required: true },
    paymentReference: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

// Generate order number before save
OrderSchema.pre("save", function (next) {
  // @ts-expect-error - this is a Mongoose Document method
  if (this.isModified("orderNumber") && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    // @ts-expect-error - this is a Mongoose Document
    this.orderNumber = `ECH-${year}${month}${day}-${random}`;
  }
  next();
});

const Order = mongoose.models.Order<IOrder> || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
