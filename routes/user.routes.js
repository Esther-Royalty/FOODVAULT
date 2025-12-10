import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {createSavingsPlan, getMyPlans, updateSavingsPlan, deleteSavingsPlan, getDashboard, getFoodPackages,selectFoodPackage } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/user/create", auth, createSavingsPlan);
router.get("/user/plan", auth, getMyPlans);
router.put("/user/update/:id", auth, updateSavingsPlan);
router.delete("/user/delete/:id", auth, deleteSavingsPlan);
router.get("/user/dashboard", auth, getDashboard);
router.get("/packages",  getFoodPackages);
router.post("/select-package", auth, selectFoodPackage);

// routes/test.js
router.get("/me", auth, (req, res) => {
  res.json({
    user: req.user,
    userId: req.user._id,
    hasId: !!req.user._id,
    has_id: !!req.user._id
  });
});


export default router;
