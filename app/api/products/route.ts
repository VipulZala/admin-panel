import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import uploadToCloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      return NextResponse.json(
        { error: "Product image is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUrl = await uploadToCloudinary(buffer);

    const price = Number(formData.get("price"));
    const discount = Number(formData.get("discount")) || 0;
    const finalPrice = price - (price * discount) / 100;

    const sizesRaw = formData.get("sizes");
    const sizes = sizesRaw ? JSON.parse(String(sizesRaw)) : [];

    const product = await Product.create({
      // STEP 1
      name: formData.get("name"),
      brand: formData.get("brand"),
      category: formData.get("category"),
      description: formData.get("description"),

      // STEP 2
      sizes,
      colors: formData.get("colors"),
      material: formData.get("material"),
      fit: formData.get("fit"),
      stock: Number(formData.get("stock")),
      sku: formData.get("sku"),

      // STEP 3
      price,
      discount,
      finalPrice,

      // STEP 4
      image: imageUrl,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      id,
      sizes,
      colors,
      stock,
      sku,
      price,
      discount,
    } = body;

    const finalPrice = price - (price * discount) / 100;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        sizes,
        colors,
        stock,
        sku,
        price,
        discount,
        finalPrice,
      },
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}







