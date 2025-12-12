import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    savingsPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SavingsPlan',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, 'Amount must be at least 1']
    },
    currency: {
        type: String,
        default: 'NGN'
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
        default: 'deposit'
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['paystack', 'bank_transfer', 'card', 'crypto'],
        default: 'paystack'
    },
    paystackReference: {
        type: String,
        // unique: true,
        // sparse: true
    },
    paystackAccessCode: String,
    // Crypto Fields
    txHash: { type: String },
    senderAddress: String,
    network: String, // e.g., 'polygon', 'ethereum'
    token: String,   // e.g., 'USDC', 'USDT'

    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    completedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ paystackReference: 1 }, { unique: true, sparse: true });
transactionSchema.index({ txHash: 1 }, { unique: true, sparse: true });


export default mongoose.model("Transaction", transactionSchema);
