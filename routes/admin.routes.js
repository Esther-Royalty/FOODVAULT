import express from "express";
import User from "../models/user.model.js";   // make sure this points to your User schema
import jwt from "jsonwebtoken";

import {
  getAllSavingsPlans,
  activateSavingsPlan,
  deleteSavingsPlan,
  getAdminStats
} from "../controllers/admin.controller.js";

import { auth } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";

const router = express.Router();

// =========================
// ADMIN LOGIN (public)
// =========================
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  if (!user.isAdmin) {
    return res.status(403).json({ message: "You are not an admin" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Admin login successful",
    token,
  });
});

// =========================
// PROTECTED ADMIN ROUTES
// =========================

router.get("/admin/plans", auth, verifyAdmin, getAllSavingsPlans);
router.patch("/admin/plan/:planId/activate", auth, verifyAdmin, activateSavingsPlan);
router.delete("/admin/plan/:planId", auth, verifyAdmin, deleteSavingsPlan);
router.get("/admin/stats", auth, verifyAdmin, getAdminStats);

export default router;
