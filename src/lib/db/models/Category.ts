import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  title: string;
  slug: string;
  description: string;
  icon: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: [true, "عنوان دسته‌بندی الزامی است"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String },
    icon: { type: String },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
