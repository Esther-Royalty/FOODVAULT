import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {createSavingsPlan, getMyPlans, updateSavingsPlan, deleteSavingsPlan, getDashboard } from "../controllers/savPlan.controller.js";

const router = express.Router();

router.post("/user/create", auth, createSavingsPlan);
router.get("/user/plan/:userId", auth, getMyPlans);
router.put("/user/update/:id", auth, updateSavingsPlan);
router.delete("/user/delete/:id", auth, deleteSavingsPlan);
router.get("/user/dashboard", auth, getDashboard);

export default router;
