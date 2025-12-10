import express from "express";
import savingsController from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

router.post("/", savingsController.createSavingsPlan);
router.get("/", savingsController.getSavingsPlan);
router.get("/:id", savingsController.getMyPlans);
router.put("/:id", savingsController.updateSavingsPlan);
router.delete("/:id", savingsController.deleteSavingsPlan);
router.get("/:id/progress", savingsController.getSavingsProgress);

export default router;

