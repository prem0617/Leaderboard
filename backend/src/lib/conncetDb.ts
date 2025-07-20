import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI as string;

if (!MONGODB_URI) throw new Error("MONGO_URI is not there");

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected");
  } catch (error) {
    console.log("error in mobgodb connection", error);
  }
}

export default connectDB;
