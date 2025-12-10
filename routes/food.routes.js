import express from "express";
import { getAllFoods, addFood } from "../controllers/food.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.middleware.js";

const router = express.Router();

// USERS: view food prices
router.get("/", getAllFoods);

// ADMIN: add food
router.post("/", verifyAdmin, addFood);

export default router;
