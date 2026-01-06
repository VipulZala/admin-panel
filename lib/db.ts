
import mongoose from "mongoose";

// Global cache (important for Next.js hot reloads)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Explicitly check for MONGODB_URI and provide more context
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Environment check failed: MONGODB_URI is undefined");
    throw new Error("MONGODB_URI is not defined. Please ensure .env.local exists and your server has been RESTARTED.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => {
      console.log("Successfully connected to MongoDB");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


