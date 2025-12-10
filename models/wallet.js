import mongoose from "mongoose";




const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    totalSaved: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'NGN'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Wallet", walletSchema);