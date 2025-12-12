import express from "express";
import { verifyDeposit, getAdminWallet } from "../controllers/crypto.controller.js";
import { auth as protect } from "../middleware/auth.middleware.js"; // Alias auth as protect

const router = express.Router();

router.get("/wallet", protect, getAdminWallet);
router.post("/verify", protect, verifyDeposit);

export default router;
