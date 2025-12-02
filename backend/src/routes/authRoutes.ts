import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { register, login, getMe } from "../controllers/authController";
import { z } from "zod";
import { validate } from "../middleware/validation";

const router = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    name: z.string().optional(),
    phone: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(1, "Пароль обязателен"),
  }),
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);

export default router;
