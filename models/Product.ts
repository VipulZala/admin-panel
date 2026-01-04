import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: String,
    brand: String,
    category: String,
    description: String,

    sizes: [String],
    colors: String,
    material: String,
    fit: String,
    sku: String,

    stock: Number,
    price: Number,
    discount: Number,
    finalPrice: Number,

    image: String,
  },
  { timestamps: true }
);

export const Product =
  models.Product || mongoose.model("Product", ProductSchema);




