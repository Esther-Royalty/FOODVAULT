import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { createSavingsPlan } from "../controllers/savPlan.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/user/create", createSavingsPlan);


export default router;
