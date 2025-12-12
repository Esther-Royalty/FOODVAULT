import SavingsPlan from "../models/SavingsPlan.js";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

// GET ALL SAVINGS PLANS (Admin)
export const getAllSavingsPlans = async (req, res, next) => {
  try {
    const plans = await SavingsPlan.find()
      .populate("userId", "firstname lastname email")
      .sort({ createdAt: -1 });

    logger.info(`Admin fetched ${plans.length} savings plans`);
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

// ACTIVATE PLAN
export const activateSavingsPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await SavingsPlan.findByIdAndUpdate(
      planId,
      { isActive: true },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Savings plan not found" });
    }

    logger.info(`Admin activated savings plan: ${planId}`);
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

// DELETE PLAN
export const deleteSavingsPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const plan = await SavingsPlan.findByIdAndDelete(planId);

    if (!plan) {
      return res.status(404).json({ message: "Savings plan not found" });
    }

    logger.info(`Admin deleted savings plan: ${planId}`);
    res.json({ message: "Plan deleted successfully", plan });
  } catch (error) {
    next(error);
  }
};

// GET ADMIN STATS
export const getAdminStats = async (req, res, next) => {
  try {
    // Run counts in parallel for performance
    const [totalUsers, totalSavingsPlans, activeSavingsPlans, inactiveSavingsPlans] = await Promise.all([
      User.countDocuments(),
      SavingsPlan.countDocuments(),
      SavingsPlan.countDocuments({ isActive: true }),
      SavingsPlan.countDocuments({ isActive: false })
    ]);

    logger.info("Admin fetched dashboard stats");

    res.json({
      totalUsers,
      totalSavingsPlans,
      activeSavingsPlans,
      inactiveSavingsPlans,
    });
  } catch (error) {
    next(error);
  }
};





