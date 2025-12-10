import mongoose from "mongoose";
import SavingsPlan from "../models/savingsPlan.js"; // Model for savings plans
import User from "../models/user.model.js";        // Model for users



export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Admins only" });
  }

  next();
};






// ADMIN ONLY MIDDLEWARE


// export const getAllSavingsPlans = async (req, res) => {
//   try {
//     // Fetch all savings plans from database
//     const plans = await SavingsPlan.find()
//       .populate("userId", "firstname lastname email") // Replace userId with selected user fields
//       .sort({ createdAt: -1 });                     // Sort from newest to oldest

//     // Respond with success, total count, and the plans
//     res.status(200).json({
//       success: true,
//       count: plans.length, // Number of plans returned
//       plans                // Array of plan objects
//     });

//   } catch (error) {
//     // Log error to console
//     console.error(error);
//     // Respond with 500 server error
//     res.status(500).json({ message: "Failed to fetch plans" });
//   }
// };

// export const deleteSavingsPlan = async (req, res) => {
//   try {
//     // Extract planId from request parameters
//     const { planId } = req.params;

//     // Validate if planId is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(planId)) {
//       return res.status(400).json({ message: "Invalid plan ID" });
//     }

//     // Delete the savings plan by ID
//     const plan = await SavingsPlan.findByIdAndDelete(planId);

//     // If plan not found, respond with 404
//     if (!plan) {
//       return res.status(404).json({ message: "Savings plan not found" });
//     }

//     // Respond with success message
//     res.status(200).json({ message: "Savings plan deleted successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const activateSavingsPlan = async (req, res) => {
//   try {
//     // Extract planId from request parameters
//     const { planId } = req.params;

//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(planId)) {
//       return res.status(400).json({ message: "Invalid plan ID" });
//     }

//     // Update the plan's isActive field to true and return the updated document
//     const plan = await SavingsPlan.findByIdAndUpdate(
//       planId,           // ID of the plan to update
//       { isActive: true }, // Update object
//       { new: true }       // Return the updated document
//     );

//     // If plan not found, respond with 404
//     if (!plan) {
//       return res.status(404).json({ message: "Savings plan not found" });
//     }

//     // Respond with success message and updated plan
//     res.status(200).json({
//       message: "Plan activated successfully",
//       plan
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const getAdminStats = async (req, res) => {
//   try {
//     // Count total users in the system
//     const totalUsers = await User.countDocuments();

//     // Count total savings plans
//     const totalSavingsPlans = await SavingsPlan.countDocuments();

//     // Count active savings plans
//     const activeSavingsPlans = await SavingsPlan.countDocuments({ isActive: true });

//     // Count inactive savings plans
//     const inactiveSavingsPlans = await SavingsPlan.countDocuments({ isActive: false });

//     // Respond with all computed stats
//     res.status(200).json({
//       totalUsers,
//       totalSavingsPlans,
//       activeSavingsPlans,
//       inactiveSavingsPlans
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch admin stats" });
//   }
// };
