import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SavingsPlan",
    required: true,
  },

  amount: { type: Number, required: true },
  type: { type: String, 
    enum: ["deduction"], default: "deduction" },
  date: { type: Date,
     default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
