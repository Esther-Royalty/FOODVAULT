import express from "express";
import auth from "../middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", auth, authController.logout);
router.get("/me", auth, authController.getMe);

export default router;
