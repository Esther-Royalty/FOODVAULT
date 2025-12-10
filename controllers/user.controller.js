import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import savingsPlan from "../models/savingsPlan.js";
import User from "../models/user.model.js";
import FoodPackage from "../models/foodPackage.model.js";
import Paystack from "paystack";
const client = new Paystack(process.env.PAYSTACK_SECRET_KEY);



export const createSavingsPlan = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT
    if (!userId) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    const {  foodType, targetAmount, frequency } = req.body;

  if(!foodType || !targetAmount || !frequency){
    return res.status(400).json({ message: "All fields are required"});
  }

    const plan = await savingsPlan.create({
      userId: req.user._id,
      foodType,
      targetAmount: Number(targetAmount),
      frequency
 // startDate: new Date(),
    });
  
    await plan.save();
  
    res.status(201).json({ message: "Savings plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ message:"Something went wrong", error: error.message });
  }
};


export const getMyPlans = async (req, res) => {
  try {
    
    
    const userId = req.user._id; // from JWT

    // Convert to ObjectId properly
    const plans = await savingsPlan.find({ userId: req.user._id });

    if (!plans || plans.length === 0) {
      return res.status(200).json({ message: "No savings plans found", plans: [] });
    }

    res.status(200).json({ 
      message: "Savings plans retrieved successfully", 
      plans 
    });
  } catch (error) {
    console.error( {message: "Get plans error", error} );
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const updateSavingsPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodType, targetAmount, frequency} = req.body;

    // THIS IS THE FIX – use ._id (not .id)
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid savings plan ID" });
    }

    const updates = {
      ...(foodType && { foodType }),
      ...(frequency && { frequency }),
      ...(typeof isActive === "boolean" && { isActive }),
      ...(targetAmount !== undefined && { targetAmount: Number(targetAmount) }),
    };

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedPlan = await savingsPlan.findOneAndUpdate(
      { 
        _id: id, 
        userId: req.user._id   // ← THIS MUST BE ._id
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Savings plan not found or not owned by you" });
    }

    return res.status(200).json({
      message: "Savings plan updated successfully",
      plan: updatedPlan
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSavingsPlan = async (req, res) => {
  try {
    const { id } = req.params; // plan ID from URL

    // Find the plan and ensure it belongs to the logged-in user
    const plan = await savingsPlan.findOne({ _id: id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: "Savings plan not found" });
    }

    // Delete the plan
    await plan.deleteOne();

    res.status(200).json({ message: "Savings plan deleted successfully" });
  } catch (error) {
    console.error("Unable to delete plan", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    const plans = await savingsPlan.find({ userId });

    const totalPlans = plans.length;
    const totalTargetAmount = plans.reduce(
      (sum, p) => sum + p.targetAmount,
      0
    );

    const autoDeductionPlans = plans.filter(p => p.isAutoDeduction).length;
    const manualPlans = totalPlans - autoDeductionPlans;

    const plansWithProgress = plans.map(p => ({
      id: p._id,
      foodType: p.foodType,
      targetAmount: p.targetAmount,
      frequency: p.frequency,
      isActive: p.isActive,
      isAutoDeduction: p.isAutoDeduction || false,
      progress: p.amountSaved
        ? ((p.amountSaved / p.targetAmount) * 100).toFixed(2)
        : "0",
    }));

    res.status(200).json({
      totalPlans,
      totalTargetAmount,
      autoDeductionPlans,
      manualPlans,
      plans: plansWithProgress
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};


export const getFoodPackages = async (req, res) => {
  try {
    const packages = await FoodPackage.find().select("-__v");
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const selectFoodPackage = async (req, res) => {
  try {
    const { packageId, custom, customItems } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let selectedPackage;

    if (custom) {
      // Create a custom package for this user
      selectedPackage = await FoodPackage.create({
        name: "Custom",
        displayName: "My Custom Package",
        description: "Created by user",
        isPredefined: false,
        customItems: customItems || []
      });
    } else {
      // Validate that the predefined package exists
      if (!packageId) {
        return res.status(400).json({ message: "Package ID is required for predefined packages" });
      }

      selectedPackage = await FoodPackage.findById(packageId);
      if (!selectedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
    }

    // Update the user's selected package
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        selectedPackage: selectedPackage._id,
        customPackageItems: custom ? customItems : [],
        hasCompletedPackageSelection: true
      },
      { new: true }
    ).populate("selectedPackage");

    res.json({
      message: "Food package selected successfully!",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        selectedPackage: user.selectedPackage,
        hasCompletedPackageSelection: user.hasCompletedPackageSelection
      }
    });

  } catch (error) {
    console.error("selectFoodPackage error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 1. Initialize Payment (called from frontend)
export const initializePayment = async (req, res) => {
  try {
    const { amount, email, planId } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ message: "Amount and email required" });
    }

    console.log("Initializing payment for:", { email, amount, planId });
    console.log("Paystack key:", process.env.PAYSTACK_SECRET_KEY);

    const transaction = await client.transaction.initialize({
      email: email, // use the email from request
      amount: amount * 100, // Paystack uses kobo
      reference: `FOODVAULT_${Date.now()}`,
      metadata: {
        userId: req.user?._id.toString() || null,
        planId: planId || null
      },
      callback_url: "http://localhost:3000/api/v1/payment/verify"
    });

    res.json({
      authorization_url: transaction.data.authorization_url,
      reference: transaction.data.reference
    });
  } catch (err) {
    console.error("Initialization error:", err);
    res.status(500).json({
      message: "Payment initialization failed",
      error: err?.response?.data || err.message
    });
  }
};

// 2. Verify Paystack Payment (Webhook or after redirect)
export const verifyPayment = async (req, res) => { 
  const ref = req.query.reference;

  if (!ref) {
    return res.status(400).json({ message: "Reference is required" });
  }

  console.log(`Verifying payment for reference: ${ref}`);

  try {
    const verification = await client.transaction.verify(ref);
    console.log("Paystack raw verification response:", verification);

    // ---- SAFETY CHECK ----
    if (!verification || !verification.data) {
      console.log("Invalid response from Paystack");
      return res.redirect("https://foodvault-36sx.onrender.com/payment-failed");
    }

    // ---- PAYMENT FAILED ----
    if (verification.data.status !== "success") {
      console.log("Payment not successful");
      return res.redirect("https://foodvault-36sx.onrender.com/payment-failed");
    }

    const { metadata, amount } = verification.data;

    // ---- PREVENT DOUBLE CREDITING ----
    const existingTxn = await Transaction.findOne({ paymentRef: ref });

    if (existingTxn) {
      console.log("Duplicate transaction attempt blocked.");
      return res.redirect(`https://foodvault-36sx.onrender.com/payment-success?ref=${ref}`);
    }

    // ---- PROCESS SAVINGS PLAN PAYMENT ----
    if (metadata?.planId) {
      const plan = await savingsPlan.findById(metadata.planId);

      if (!plan) {
        console.log("Plan not found");
        return res.redirect("https://foodvault-36sx.onrender.com/payment-failed");
      }

      // Convert kobo → naira
      const paidAmount = amount / 100;

      // Update plan balance
      await savingsPlan.findByIdAndUpdate(metadata.planId, {
        $inc: { currentAmount: paidAmount },
        lastPaymentRef: ref,
      });

      // Save transaction record
      await Transaction.create({
        planId: metadata.planId,
        amount: paidAmount,
        type: "deduction",
        paymentRef: ref,
      });
    }

    // ---- REDIRECT ON SUCCESS ----
    return res.redirect(`https://foodvault-36sx.onrender.com/payment-success?ref=${ref}`);

  } catch (err) {
    console.error("Paystack verification error:", err.response?.data || err);
    return res.redirect("https://foodvault-36sx.onrender.com/payment-failed");
  }
};



