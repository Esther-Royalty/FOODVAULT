import express from "express";
import { addFood } from "../controllers/food.controller.js";
import { getMarketplace, getMarketItem } from "../controllers/market.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";
import { auth } from "../middleware/auth.middleware.js"; // Optional: if market is public, no auth needed. Assuming public.

const router = express.Router();

// MARKETPLACE (Public)
router.get("/", getMarketplace);
router.get("/:id", getMarketItem);

import { validate } from "../middleware/validate.js";
import { addFoodSchema } from "../validations/food.validation.js";

// ADMIN: add food
// Note: You might want to validate input here too using Joi, similar to auth/admin routes
router.post("/", auth, verifyAdmin, validate(addFoodSchema), addFood);

export default router;
