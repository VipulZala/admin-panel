import mongoose, { Schema, models } from "mongoose";

const adminSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export const Admin =
  models.Admin || mongoose.model("Admin", adminSchema);

