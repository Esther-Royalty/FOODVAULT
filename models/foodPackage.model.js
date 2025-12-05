
import mongoose from "mongoose";

const foodPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Swallow", "Detty December", "Student Pack", "Custom"],
    unique: true
  },
  displayName: { type: String, required: true },
  description: String,
  isPredefined: { type: Boolean, default: true },

  defaultItems: [{
    name: String,
    quantity: Number,
    unit: String
  }],

  customItems: [{
    name: String,
    quantity: Number,
    unit: String
  }]
}, { timestamps: true });

export default mongoose.model("FoodPackage", foodPackageSchema);