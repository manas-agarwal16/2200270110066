import mongoose from "mongoose";

const DB = async () => {
  try {
    // console.log("DB_URL: ", process.env.DB_URL);
    const connectDB = await mongoose.connect(
      `${process.env.DB_URL}`
    );
    console.log(`MongoDB connected, DB HOST:  ${connectDB.connection.host}`);
  } catch (error) {
    console.error("error connecting to the database:", error);
    
    throw error;
  }
};

export default DB;
