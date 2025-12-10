import mongoose from "mongoose";

export const savingsPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Plan title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    targetAmount: {
        type: Number,
        required: [true, "Target amount is required"],
        min: [100, "Minimum target amount is 100"]
    },
    monthlyAmount: {
        type: Number,
        required: [true, "Monthly savings amount is required"],
        min: [50, "Minimum monthly savings is 50"]
    },
    durationMonths: {
        type: Number,
        required: true,
        min: [3, "Minimum savings duration is 3 months"],
        max: [36, "Maximum savings duration is 36 months"]
    },
    paymentType: {
        type: String,
        enum: ["one-time", "recurring"],
        default: "one-time"
    },
    recurrence: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "monthly"
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active"
    },
    currentBalance: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    completedAt: Date,
    autoDebit: {
        type: Boolean,
        default: false
    },
    nextPaymentDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Calculate end date and next payment date before saving
 */
savingsPlanSchema.pre("save", function () {
    if (
        this.isModified("durationMonths") ||
        this.isModified("startDate") ||
        this.isNew
    ) {
        const endDate = new Date(this.startDate);
        endDate.setMonth(endDate.getMonth() + this.durationMonths);
        this.endDate = endDate;

        if (this.paymentType === "recurring") {
            this.nextPaymentDate = new Date();
            this.nextPaymentDate.setDate(this.nextPaymentDate.getDate() + 1);
        }
    }
});


const SavingsPlan =
    mongoose.models.SavingsPlan ||
    mongoose.model("SavingsPlan", savingsPlanSchema);

export default SavingsPlan;
