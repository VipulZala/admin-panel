import { z } from "zod";
export const step1Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["Men", "Women", "Kids"]),
  description: z.string().min(1, "Description is required"),
});
export const step2Schema = z.object({
  sizes: z.array(z.string()).min(1, "Add at least one size"),
  colors: z.string().min(1, "Colors required"),
  material: z.string().min(1, "Material required"),
  fit: z.enum(["Slim", "Regular", "Oversized"]),
  stock: z.coerce.number().min(0, "Stock required"),
  sku: z.string().min(1, "SKU required"),
});
export const step3Schema = z.object({
  price: z.number().positive("Price must be greater than 0"),
  discount: z.number().min(0).max(90),
});











