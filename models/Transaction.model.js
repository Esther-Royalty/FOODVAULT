import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SavingsPlan",
    required: true,
  },

  paymentRef: {
    type: String,
    unique: true,
  },

  amount: { type: Number, required: true },
  type: { type: String, 
    enum: ["deduction"], default: "deduction" },
  date: { type: Date,
     default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
