
import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ["Grains", "Tubers", "Proteins", "Oils", "Seasonings", "Others"],
    default: "Others"
  },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, enum: ["kg", "liter", "pack", "bag"], required: true },
  image: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("FoodItem", foodItemSchema);