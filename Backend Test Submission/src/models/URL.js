import mongoose from 'mongoose';
import {clickSchema} from './Clickurl.js';

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  clickData: [clickSchema]
});

export default mongoose.model('Url', urlSchema);
