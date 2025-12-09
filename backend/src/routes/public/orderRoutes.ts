import { Router } from "express";
import {
  createOrder,
  getOrder,
  getUserOrders,
} from "../../controllers/public/orderController";

const router = Router();

// Создать заказ
router.post("/", createOrder);

// Получить заказ по ID
router.get("/:orderId", getOrder);

// Получить все заказы пользователя
router.get("/", getUserOrders);

export default router;

