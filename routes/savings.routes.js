import express from "express";
import {
    createSavingsPlan,
    getMyPlans,
    updateSavingsPlan,
    deleteSavingsPlan,
    getDashboard
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

router.post("/", createSavingsPlan);
router.get("/", getMyPlans); // Get all user plans
router.get("/dashboard", getDashboard); // Detailed dashboard stats
router.put("/:id", updateSavingsPlan);
router.delete("/:id", deleteSavingsPlan);

export default router;
