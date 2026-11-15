import mongoose, { Document, Schema } from "mongoose";

export type DeliveryMethod = "manual" | "stock" | "api" | "upgrade" | "gift_code" | "scheduled";

export interface IPlan {
  title: string;
  price: number;
  compareAt?: number;
  delivery: DeliveryMethod;
  stock: number;
  description?: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  brand: string;
  logo: string;
  category: mongoose.Types.ObjectId;
  excerpt: string;
  description: string;
  badge?: string;
  rating: number;
  sold: number;
  gradient: string;
  plans: IPlan[];
  features: string[];
  faq: { q: string; a: string }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  compareAt: { type: Number },
  delivery: {
    type: String,
    enum: ["manual", "stock", "api", "upgrade", "gift_code", "scheduled"],
    default: "manual",
  },
  stock: { type: Number, default: 0 },
  description: { type: String },
});

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "عنوان محصول الزامی است"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    brand: { type: String, required: true },
    logo: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    excerpt: { type: String, required: true },
    description: { type: String, required: true },
    badge: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    sold: { type: Number, default: 0 },
    gradient: { type: String, default: "from-[#1b39f5] to-[#7cc0f5]" },
    plans: { type: [PlanSchema], default: [] },
    features: { type: [String], default: [] },
    faq: {
      type: [
        {
          q: { type: String, required: true },
          a: { type: String, required: true },
        },
      ],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
