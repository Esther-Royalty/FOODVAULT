import Savingsplan from "../models/user.model.js";


//for a new user to create a savings plan
export const createSavingsPlan = async (req, res) => {
  try {
    const {  foodType, targetAmount, frequency } = req.body;

    const plan = await Savingsplan.create({
      foodType,
      targetAmount: Number(targetAmount),
      frequency,
  
    });

    res.json({ message: "Savings plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ message:"Something went wrong", error });
  }
};


//for a user to see their savings plan
export const getMyPlans = async (req, res) => {
  try {

    const userId = req.user.id;
    const plans = await Savingsplan.find({ userId: mongoose.Types.ObjectId(req.params.userId) });

    res.status(200).json({ message: "Savings plans retrieved successfully", plans });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
//for a user to update their savings plan
export const updateSavingsPlan = async (req, res) => {
  try {
    const { id } = req.params; 
    const { userId, foodType, targetAmount, frequency, isActive } = req.body;

    // Find the plan by ID and ensure it belongs to the logged-in user
    const plan = await Savingsplan.findOne({ _id: id, userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ message: "Savings plan not found" });
    }

    // Update only the fields provided
    if (foodType) plan.foodType = foodType;
    if (targetAmount) plan.targetAmount = Number(targetAmount);
    if (frequency) plan.frequency = frequency;
    if (typeof isActive === "boolean") plan.isActive = isActive;

    await plan.save();

    res.status(200).json({ message: "Savings plan updated successfully", plan, });
  } catch (error) {
    console.error("Update plan error", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export const deleteSavingsPlan = async (req, res) => {
  try {
    const { id } = req.params; // plan ID from URL

    // Find the plan and ensure it belongs to the logged-in user
    const plan = await Savingsplan.findOne({ _id: id, userId: req.user.id });
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
    const userId = req.user.id;

    // Fetch all savings plans for this user
    const plans = await Savingsplan.find({ userId });

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




