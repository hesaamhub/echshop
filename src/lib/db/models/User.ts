import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "لطفاً نام خود را وارد کنید"],
      trim: true,
      maxlength: [100, "نام نمی‌تواند بیش از 100 کاراکتر باشد"],
    },
    email: {
      type: String,
      required: [true, "لطفاً ایمیل خود را وارد کنید"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "لطفاً یک ایمیل معتبر وارد کنید",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^09\d{9}$/, "شماره موبایل معتبر نیست"],
    },
    password: {
      type: String,
      required: [true, "لطفاً رمز عبور خود را وارد کنید"],
      minlength: [8, "رمز عبور باید حداقل 8 کاراکتر باشد"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // @ts-expect-error - this is a Mongoose Document method
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    // @ts-expect-error - this is a Mongoose Document
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // @ts-expect-error - this is a Mongoose Document
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User<IUser> || mongoose.model<IUser>("User", UserSchema);

export default User;
