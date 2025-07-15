import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ip: String
});


export default mongoose.model("Click", clickSchema);
export { clickSchema };