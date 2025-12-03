import express from "express";
import { adminOnly, auth } from "../middleware/auth.middleware.js";
// import { getAllUsers, getAllPlans } from "../controllers/admin.controller.js";

const router = express.Router();

// router.get("/users", auth, adminOnly, getAllUsers);
// router.get("/plans", auth, adminOnly, getAllPlans);

export default router;
