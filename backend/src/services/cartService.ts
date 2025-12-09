import { Cart, ICart, ICartItem } from "../models/Cart";
import { Bouquet } from "../models/Bouquet";
import mongoose from "mongoose";

export class CartService {
  /**
   * Получить или создать корзину для пользователя или сессии
   */
  static async getOrCreateCart(
    userId?: string,
    sessionId?: string
  ): Promise<ICart> {
    const query: any = {};
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      throw new Error("Требуется userId или sessionId");
    }

    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        sessionId: sessionId,
        items: [],
      });
      await cart.save();
    }

    return cart;
  }

  /**
   * Получить корзину с заполненными данными о букетах
   */
  static async getCartWithItems(
    userId?: string,
    sessionId?: string
  ): Promise<ICart | null> {
    const query: any = {};
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return null;
    }

    const cart = await Cart.findOne(query).populate({
      path: "items.bouquetId",
      model: "Bouquet",
      select: "name slug price oldPrice images inStock",
    });

    return cart;
  }

  /**
   * Добавить товар в корзину
   */
  static async addItem(
    bouquetId: string,
    quantity: number = 1,
    userId?: string,
    sessionId?: string
  ): Promise<ICart> {
    if (!mongoose.Types.ObjectId.isValid(bouquetId)) {
      throw new Error("Неверный ID букета");
    }

    // Проверяем существование букета
    const bouquet = await Bouquet.findById(bouquetId);
    if (!bouquet) {
      throw new Error("Букет не найден");
    }

    if (!bouquet.inStock) {
      throw new Error("Букет отсутствует в наличии");
    }

    const cart = await this.getOrCreateCart(userId, sessionId);

    // Проверяем, есть ли уже такой товар в корзине
    const existingItemIndex = cart.items.findIndex(
      (item) => item.bouquetId.toString() === bouquetId
    );

    if (existingItemIndex >= 0) {
      // Увеличиваем количество
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Добавляем новый товар
      cart.items.push({
        bouquetId: new mongoose.Types.ObjectId(bouquetId),
        quantity,
      });
    }

    await cart.save();
    return cart;
  }

  /**
   * Обновить количество товара в корзине
   */
  static async updateItemQuantity(
    bouquetId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ): Promise<ICart> {
    if (quantity < 1) {
      throw new Error("Количество должно быть больше 0");
    }

    const cart = await this.getOrCreateCart(userId, sessionId);

    const itemIndex = cart.items.findIndex(
      (item) => item.bouquetId.toString() === bouquetId
    );

    if (itemIndex === -1) {
      throw new Error("Товар не найден в корзине");
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return cart;
  }

  /**
   * Удалить товар из корзины
   */
  static async removeItem(
    bouquetId: string,
    userId?: string,
    sessionId?: string
  ): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId, sessionId);

    cart.items = cart.items.filter(
      (item) => item.bouquetId.toString() !== bouquetId
    );

    await cart.save();
    return cart;
  }

  /**
   * Очистить корзину
   */
  static async clearCart(userId?: string, sessionId?: string): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId, sessionId);
    cart.items = [];
    await cart.save();
    return cart;
  }

  /**
   * Получить количество товаров в корзине
   */
  static async getCartItemCount(
    userId?: string,
    sessionId?: string
  ): Promise<number> {
    const query: any = {};
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return 0;
    }

    const cart = await Cart.findOne(query);
    if (!cart) {
      return 0;
    }

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }
}
