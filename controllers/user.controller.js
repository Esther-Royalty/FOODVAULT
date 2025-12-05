import mongoose from "mongoose";
import SavingsPlan from "../models/savingsPlan.js";
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

    const plan = await SavingsPlan.create({
      userId: req.user._id,
      foodType,
      targetAmount: Number(targetAmount),
      frequency


      // // Optionally set default values like:
      // currentAmount: 0,
      // status: 'active',
      // startDate: new Date(),
    });
  
  
    res.status(201).json({ message: "Savings plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ message:"Something went wrong", error: error.message });
  }
};


export const getMyPlans = async (req, res) => {
  try {
    
    
    const userId = req.user._id; // from JWT

    // Convert to ObjectId properly
    const plans = await SavingsPlan.find({ userId: req.user._id });

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

    const updatedPlan = await Savingsplan.findOneAndUpdate(
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
    const plan = await SavingsPlan.findOne({ _id: id, userId: req.user._id });
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
    const userId = req.user._id;

    // Fetch all savings plans for this user
    const plans = await SavingsPlan.find({ userId: req.user._id });

    // Calculate totals and counts
    const totalPlans = plans.length;
    const totalTargetAmount = plans.reduce((sum, p) => sum + p.targetAmount, 0);

    // Count auto-deduction plans vs manual payment
    const autoDeductionPlans = plans.filter(p => p.isAutoDeduction).length;
    const manualPlans = totalPlans - autoDeductionPlans;

    // You can also calculate progress for each plan if you track amountSaved
    const plansWithProgress = plans.map(p => ({
      id: p._id,
      foodType: p.foodType,
      targetAmount: p.targetAmount,
      frequency: p.frequency,
      isActive: p.isActive,
      isAutoDeduction: p.isAutoDeduction || false,
      // amountSaved: p.amountSaved || 0, // uncomment if you track saved amount
      progress: p.amountSaved ? ((p.amountSaved / p.targetAmount) * 100).toFixed(2) : "0",
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
    res.status(500).json({ message: "Something went wrong", error: error.message });
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
    const { packageId, customItems } = req.body; // customItems only if "Custom"

    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    let selectedPackage;

    if (packageId === "custom" || !packageId) {
      // Create a custom package for this user
      selectedPackage = await FoodPackage.create({
        name: "Custom",
        displayName: "My Custom Package",
        description: "Created by user",
        isPredefined: false,
        customItems: customItems || []
      });
    } else {
      // Validate predefined package exists
      selectedPackage = await FoodPackage.findById(packageId);
      if (!selectedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
    }

    // Update user's selected package
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        selectedPackage: selectedPackage._id,
        customPackageItems: packageId === "custom" ? customItems : [],
        hasCompletedPackageSelection: true
      },
      { new: true }
    ).populate("selectedPackage");

    res.json({
      message: "Food package selected successfully!",
      user: {
        name: user.name,
        selectedPackage: user.selectedPackage,
        hasCompletedPackageSelection: true
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 1. Initialize Payment (called from frontend)
export const initializePayment = async (req, res) => {
  try {
    const { amount, email, planId } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ message: "Amount and email required" });
    }

    const transaction = await client.transaction.initialize({
      email,
      amount: amount * 100, // Paystack uses kobo
      metadata: {
        userId: req.user._id.toString(),
        planId: planId || null
      }
    });

    res.json({
      authorization_url: transaction.data.authorization_url,
      reference: transaction.data.reference
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

// 2. Verify Payment (Webhook or after redirect)
export const verifyPayment = async (req, res) => {
  const ref = req.query.reference;

  try {
    const verification = await client.transaction.verify(ref);

    if (verification.data.status === "success") {
      const { metadata, amount, customer } = verification.data;

      // Mark user's plan as funded or create transaction record
      // Example: update savings plan
      if (metadata.planId) {
        await SavingsPlan.findByIdAndUpdate(metadata.planId, {
          $inc: { currentAmount: amount / 100 },
          lastPaymentRef: ref
        });
      }

      // Redirect user to success page
      return res.redirect(`https://yourapp.com/payment-success?ref=${ref}`);
    } else {
      return res.redirect(`https://yourapp.com/payment-failed`);
    }
  } catch (err) {
    res.redirect(`https://yourapp.com/payment-failed`);
  }
};


// Update only the fields provided
    // if (foodType) plan.foodType = foodType;
    // if (targetAmount) plan.targetAmount = Number(targetAmount);
    // if (frequency) plan.frequency = frequency;
    // if (typeof isActive === "boolean") plan.isActive = isActive;

    // await plan.save();



