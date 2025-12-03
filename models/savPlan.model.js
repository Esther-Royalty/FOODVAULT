import mongoose from "mongoose";

const SavingsPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  foodType: { type: String,
     required: true },       // e.g "Rice", "Beans"

  targetAmount: { type: Number, 
    required: true },   // e.g 20000

  frequency: { type: String, enum: ["daily", "weekly", "monthly"],
     required: true },

  isActive: { type: Boolean,
     default: true }, // paused or running
});

export default mongoose.model("SavingsPlan", SavingsPlanSchema);
