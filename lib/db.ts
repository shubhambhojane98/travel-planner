import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("DB is Connected");
  } catch (error) {
    console.log(error);
    throw new Error("Connection failed!");
  }
};

export default connectMongoDB;
