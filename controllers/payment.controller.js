import Paystack from "paystack";
const client = new Paystack(process.env.PAYSTACK_SECRET_KEY);


import Transaction from "../models/Transaction.model.js";
import SavingsPlan from "../models/SavingsPlan.js";
import Wallet from "../models/wallet.js";
import User from "../models/user.model.js";
import paystackService from "../utils/paystackService.js";



// Initialize payment
export const initializePayment = async (req, res, next) => {
    try {
        const { savingsPlanId, amount } = req.body;

        // Get savings plan
        const savingsPlan = await SavingsPlan.findOne({
            _id: savingsPlanId,
            user: req.userId,
            status: "active"
        });

        if (!savingsPlan) {
            return res.status(404).json({
                success: false,
                message: "Savings plan not found"
            });
        }

        // Validate amount
        const paymentAmount = amount || savingsPlan.monthlyAmount;
        if (paymentAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }

        // Get user email for Paystack
        const user = await User.findById(req.userId);

        // Create transaction record
        const transaction = await Transaction.create({
            user: req.userId,
            savingsPlan: savingsPlanId,
            amount: paymentAmount,
            status: "pending",
            paymentMethod: "paystack"
        });

        // Initialize Paystack payment
        const paystackResponse = await paystackService.initializeTransaction(
            user.email,
            paymentAmount,
            {
                transactionId: transaction._id.toString(),
                userId: req.userId.toString(),
                savingsPlanId: savingsPlanId.toString(),
                purpose: "savings_deposit"
            }
        );

        if (!paystackResponse.success) {
            transaction.status = "failed";
            await transaction.save();

            return res.status(400).json({
                success: false,
                message: paystackResponse.error
            });
        }

        // Update transaction with Paystack reference
        transaction.paystackReference = paystackResponse.data.reference;
        transaction.paystackAccessCode = paystackResponse.data.access_code;
        await transaction.save();

        res.json({
            success: true,
            message: "Payment initialized successfully",
            data: {
                authorization_url: paystackResponse.data.authorization_url,
                access_code: paystackResponse.data.access_code,
                reference: paystackResponse.data.reference,
                transactionId: transaction._id
            }
        });
    } catch (error) {
        next(error);
    }
};

// Verify payment (Callback from Paystack)
export const verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "Payment reference is required"
            });
        }

        // Find transaction
        const transaction = await Transaction.findOne({ paystackReference: reference });
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // If already verified
        if (transaction.status === "successful") {
            return res.json({
                success: true,
                message: "Payment already verified",
                data: transaction
            });
        }

        // Verify with Paystack
        const verification = await paystackService.verifyTransaction(reference);

        if (!verification.success) {
            transaction.status = "failed";
            await transaction.save();

            return res.status(400).json({
                success: false,
                message: verification.error
            });
        }

        const paystackData = verification.data;

        // Update transaction status based on Paystack response
        if (paystackData.status === "success") {
            transaction.status = "successful";
            transaction.completedAt = new Date();
            transaction.metadata = paystackData;

            // Update savings plan balance
            const savingsPlan = await SavingsPlan.findById(transaction.savingsPlan);
            if (savingsPlan) {
                savingsPlan.currentBalance += transaction.amount;

                if (savingsPlan.currentBalance >= savingsPlan.targetAmount) {
                    savingsPlan.status = "completed";
                    savingsPlan.completedAt = new Date();
                }

                await savingsPlan.save();
            }

            // Update wallet
            const wallet = await Wallet.findOne({ user: transaction.user });
            if (wallet) {
                wallet.balance += transaction.amount;
                wallet.totalSaved += transaction.amount;
                wallet.lastUpdated = new Date();
                await wallet.save();
            }
        } else {
            transaction.status = "failed";
        }

        await transaction.save();

        res.json({
            success: true,
            message: transaction.status === "successful"
                ? "Payment verified successfully"
                : "Payment failed",
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

// Get transaction history
export const getTransactions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        let query = { user: req.userId };
        if (status) {
            query.status = status;
        }

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("savingsPlan", "title");

        const total = await Transaction.countDocuments(query);

        res.json({
            success: true,
            count: transactions.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: transactions
        });
    } catch (error) {
        next(error);
    }
};

// Webhook handler for Paystack
export const paystackWebhook = async (req, res, next) => {
    try {
        const secretHash = process.env.PAYSTACK_SECRET_HASH;
        const signature = req.headers["x-paystack-signature"];

        // You should verify the signature here
        const event = req.body;

        if (event.event === "charge.success") {
            const data = event.data;

            const transaction = await Transaction.findOne({
                paystackReference: data.reference
            });

            if (transaction && transaction.status === "pending") {
                transaction.status = "successful";
                transaction.completedAt = new Date();
                transaction.metadata = data;

                // Update savings plan and wallet
                const savingsPlan = await SavingsPlan.findById(transaction.savingsPlan);
                if (savingsPlan) {
                    savingsPlan.currentBalance += transaction.amount;

                    if (savingsPlan.currentBalance >= savingsPlan.targetAmount) {
                        savingsPlan.status = "completed";
                        savingsPlan.completedAt = new Date();
                    }

                    await savingsPlan.save();
                }

                const wallet = await Wallet.findOne({ user: transaction.user });
                if (wallet) {
                    wallet.balance += transaction.amount;
                    wallet.totalSaved += transaction.amount;
                    wallet.lastUpdated = new Date();
                    await wallet.save();
                }

                await transaction.save();
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(400);
    }
};

export default {
    initializePayment,
    verifyPayment,
    getTransactions,
    paystackWebhook
};

