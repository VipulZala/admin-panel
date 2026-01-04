import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcrypt";
import { connectDB } from "../lib/db.ts";
import { Admin } from "../models/Admin.ts";

async function createAdmin() {
  await connectDB();

  const email = "admin@dashboard.com";
  const password = "admin123";

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created successfully");
  console.log("Email:", email);
  console.log("Password:", password);

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});




