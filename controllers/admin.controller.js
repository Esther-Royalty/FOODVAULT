import mongoose from "mongoose";
import SavingsPlan from "../models/savPlan.model.js";



export const getAllSavingsPlans = async (req, res) => {
  try {
    const plans = await SavingsPlan.find().populate("userId", "firstname lastname email");
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
export const deactivateSavingsPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await SavingsPlan.findByIdAndUpdate(
      planId,
        { isActive: false },
        { new: true }
    );
    if (!plan) {
      return res.status(404).json({ message: "Savings plan not found" });
    }
    res.json(plan);
    } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
export const activateSavingsPlan = async (req, res) => {
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
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
export const deleteSavingsPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await SavingsPlan.findByIdAndDelete(planId);
    if (!plan) {
      return res.status(404).json({ message: "Savings plan not found" });
    }
    res.json(plan);
    } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};