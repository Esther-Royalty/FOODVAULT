import { ethers } from "ethers";
import Transaction from "../models/Transaction.model.js";
import SavingsPlan from "../models/SavingsPlan.js";
import User from "../models/user.model.js";

// Initialize provider (Fallbacks to default public providers if no env var)
// Ideally use: new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL)
const provider = new ethers.getDefaultProvider("matic"); // Polygon Mainnet

const ADMIN_WALLET = process.env.ADMIN_WALLET_ADDRESS;

export const verifyDeposit = async (req, res) => {
    try {
        const { txHash, savingsPlanId, network } = req.body;
        const userId = req.user._id;

        if (!txHash || !savingsPlanId) {
            return res.status(400).json({ message: "Transaction Hash and Plan ID required" });
        }

        // 1. Check if transaction already recorded
        const existingTx = await Transaction.findOne({ txHash });
        if (existingTx) {
            return res.status(409).json({ message: "Transaction already processed" });
        }

        // 2. Fetch Transaction from Blockchain
        // Note: For production, allow switching providers based on `network` body param
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        if (!tx || !receipt) {
            return res.status(404).json({ message: "Transaction not found on chain" });
        }

        // 3. Verify Transaction Details
        if (receipt.status !== 1) {
            return res.status(400).json({ message: "Transaction failed on chain" });
        }

        // Check Recipient
        if (tx.to.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
            return res.status(400).json({ message: "Transaction not sent to Admin Wallet" });
        }

        // Logic for Native Token (MATIC) vs ERC20 (USDC)
        // For MVP, assuming Native MATIC transfer for simplicity, or we parse logs for ERC20.
        // Let's assume Native MATIC for now as per "simple" integration, 
        // but code below handles Native amount.
        const valueInEther = ethers.formatEther(tx.value);

        // 4. Update Database
        const newTx = await Transaction.create({
            user: userId,
            savingsPlan: savingsPlanId,
            txHash: tx.hash,
            senderAddress: tx.from,
            amount: Number(valueInEther),
            currency: "MATIC", // Hardcoded for this specific provider setup
            network: network || "polygon",
            status: "successful",
            paymentMethod: "crypto",
            metadata: { blockNumber: tx.blockNumber }
        });

        // 5. Update Savings Plan
        const plan = await SavingsPlan.findById(savingsPlanId);
        if (plan) {
            // Assuming savings plan tracks amount in a compatible unit or currency conversion needed
            // For now, 1 MATIC = 1 Unit of currency in DB? Likely mismatch.
            // We will just add it. In real app, fetch Oracle price.
            plan.currentAmount = (plan.currentAmount || 0) + Number(valueInEther); // Simply adding numeric value
            await plan.save();
        }

        res.status(200).json({
            message: "Deposit verified successfully",
            transaction: newTx,
            plan
        });

    } catch (error) {
        console.error("Crypto Verify Error:", error);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};

export const getAdminWallet = (req, res) => {
    res.json({ address: ADMIN_WALLET });
};
