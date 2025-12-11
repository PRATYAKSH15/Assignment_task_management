import express from "express";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);

export default router;
