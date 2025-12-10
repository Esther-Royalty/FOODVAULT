import express from "express";
import paymentController from "../controllers/payment.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes except webhook
router.use(auth);

router.post("/initialize", paymentController.initializePayment);
router.get("/verify", paymentController.verifyPayment);
router.get("/transactions", paymentController.getTransactions);

// Webhook endpoint (no auth required)
router.post(
    "/webhook/paystack",
    express.raw({ type: "application/json" }),
    paymentController.paystackWebhook
);

export default router;
