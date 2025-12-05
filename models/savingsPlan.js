import mongoose from "mongoose";




const savingsPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  foodType: {
    type: String,
    required: true,
    enum: ["Rice", "Beans", "Yam", "Garri", "Oil", "Chicken", "Custom"]
  },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true
  },
  isActive: { type: Boolean, default: true },
  isAutoDeduction: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("SavingsPlan", savingsPlanSchema);