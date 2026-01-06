
import mongoose from "mongoose";

// Global cache (important for Next.js hot reloads)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is missing");
    throw new Error("MONGODB_URI is not defined.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 1, // Optimization for serverless
    };

    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("Connected to MongoDB successfully");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB connection error details:", err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on failure
    throw e;
  }
  return cached.conn;
}


