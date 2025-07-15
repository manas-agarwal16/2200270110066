import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
const PORT = process.env.PORT || 8000;

import connectDB from "./db/connectDB.js";

(async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

