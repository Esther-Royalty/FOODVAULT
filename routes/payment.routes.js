import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { initializePayment, verifyPayment } from "../controllers/user.controller.js";
import { paystackWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

// Initialize payment (frontend hits this)
router.post("/initialize", initializePayment);

// Verify payment (Paystack webhook or after redirect)
router.get("/verify", verifyPayment);

// Paystack Webhook (NO auth middleware)
router.post("/webhook/paystack", paystackWebhook);
router.get("/test", (req, res) => {res.send("Payment route is working")});

export default router;
