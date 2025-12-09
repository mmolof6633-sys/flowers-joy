import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount,
} from "../../controllers/public/cartController";

const router = Router();

// Получить корзину
router.get("/", getCart);

// Получить количество товаров в корзине
router.get("/count", getCartItemCount);

// Добавить товар в корзину
router.post("/items", addToCart);

// Обновить количество товара
router.put("/items/:bouquetId", updateCartItem);

// Удалить товар из корзины
router.delete("/items/:bouquetId", removeFromCart);

// Очистить корзину
router.delete("/", clearCart);

export default router;
