import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { Admin } from "@/models/Admin";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  await connectDB();

  let admin = await Admin.findOne({ email });

  if (!admin) {
    admin = await Admin.create({
      email,
      role: "admin",
      password: "temp1234",
    });

    return NextResponse.json({
      message: "Admin created successfully with temporary access",
    });
  }

  if (admin.role === "admin") {
    return NextResponse.json({
      message: "Admin already exists",
    });
  }

  admin.role = "admin";
  await admin.save();

  return NextResponse.json({
    message: "Admin onboarded successfully",
  });

}


