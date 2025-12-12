import express from "express";
import auth from "../middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);
router.post("/logout", auth, authController.logout);
router.get("/me", auth, authController.getMe);

export default router;
