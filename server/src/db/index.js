import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDB connected successfully !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed !!!", error || error.message);
    process.exit(1);
  }
};

export default connectDB;
