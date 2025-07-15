import mongoose from "mongoose";

const DB = async () => {
  try {
    console.log("MONGODB_URL: ", process.env.DB_URL);
    const connectDB = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`MongoDB connected, DB HOST:  ${connectDB.connection.host}`);
  } catch (error) {
    throw error;
  }
};

export default DB;
