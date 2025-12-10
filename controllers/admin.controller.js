// import the SavingsPlan Mongoose model to query the savings plans collection
import SavingsPlan from "../models/SavingsPlan.js";   // (imports the SavingsPlan schema/model)

// import mongoose for ObjectId validation and other utilities
import mongoose from "mongoose";                      // (used below to validate planId)

// NOTE: `User` is referenced in getAdminStats, so we must import it
import User from "../models/user.model.js";          // (imports User model for admin stats)



// GET ALL SAVINGS PLANS (Admin)
export const getAllSavingsPlans = async (req, res) => {
  try {
    // Find all savings plans, populate the userId field with firstname, lastname, email from users, sort newest first
    const plans = await SavingsPlan.find()                           // -> runs a query to get all documents in the SavingsPlan collection
      .populate("userId", "firstname lastname email")                // -> replaces userId ObjectId with selected user fields
      .sort({ createdAt: -1 });                                      // -> sorts by createdAt descending (newest first)

    // Return the array of plans as JSON
    res.json(plans);                                                 // -> sends HTTP 200 with plans array in JSON
  } catch (error) {
    // If anything goes wrong, return a 500 and include the error
    res.status(500).json({ message: "Something went wrong", error }); // -> HTTP 500 with error object
  }
};

// ACTIVATE PLAN
export const activateSavingsPlan = async (req, res) => {
  try {
    const { planId } = req.params;                                   // -> extract planId from the URL params

    // Validate planId
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }

    // Set isActive to true and return the updated plan
    const plan = await SavingsPlan.findByIdAndUpdate(
      planId,
      { isActive: true },
      { new: true }
    );

    // If plan not found, return 404
    if (!plan) return res.status(404).json({ message: "Savings plan not found" });

    // Return the updated plan
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// DELETE PLAN
export const deleteSavingsPlan = async (req, res) => {
  try {
    const { planId } = req.params;                                   // -> extract planId from URL

    // Validate planId
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }

    // Delete the document and return the deleted document
    const plan = await SavingsPlan.findByIdAndDelete(planId);        // -> removes the document from DB

    // If nothing was deleted (no matching id), return 404
    if (!plan) return res.status(404).json({ message: "Savings plan not found" });

    // Confirm deletion and include the deleted plan
    res.json({ message: "Plan deleted successfully", plan });
  } catch (error) {
    // Error handler
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// GETADMINSTATS
export const getAdminStats = async (req, res) => {
  try { 
    // Count total users in the User collection
    const totalUsers = await User.countDocuments();                 // -> returns a number (count of users)

    // Count all savings plans
    const totalSavingsPlans = await SavingsPlan.countDocuments();   // -> total number of plans

    // Count plans where isActive is true
    const activeSavingsPlans = await SavingsPlan.countDocuments({ isActive: true }); // -> number of active plans

    // Count plans where isActive is false
    const inactiveSavingsPlans = await SavingsPlan.countDocuments({ isActive: false }); // -> number of inactive plans
    
    // Return the aggregated counts as JSON
    res.json({
      totalUsers,
      totalSavingsPlans,  
      activeSavingsPlans,
      inactiveSavingsPlans
    });
  } catch (error) {
    // Generic error handler
    res.status(500).json({ message: "Something went wrong" });
  }
};




