import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { CartService } from "../../services/cartService";
import { v4 as uuidv4 } from "uuid";

// Получить или создать sessionId из cookies
function getSessionId(req: Request, res: Response): string {
  let sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    sessionId = uuidv4();
    // Установим cookie в ответе
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      sameSite: "lax",
    });
  }
  return sessionId;
}

export const getCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    const cart = await CartService.getCartWithItems(userId, sessionId);

    if (!cart) {
      res.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
      return;
    }

    // Вычисляем общую стоимость
    let totalPrice = 0;
    const items = cart.items.map((item: any) => {
      const bouquet = item.bouquetId;
      if (bouquet && bouquet.price) {
        const itemTotal = bouquet.price * item.quantity;
        totalPrice += itemTotal;
        const bouquetId = bouquet._id?.toString() || bouquet._id;
        return {
          bouquetId: bouquetId,
          bouquet: {
            _id: bouquetId,
            id: bouquetId,
            name: bouquet.name,
            slug: bouquet.slug,
            price: bouquet.price,
            oldPrice: bouquet.oldPrice,
            images: bouquet.images,
            inStock: bouquet.inStock,
          },
          quantity: item.quantity,
          totalPrice: itemTotal,
        };
      }
      return null;
    }).filter(Boolean);

    const totalItems = items.reduce(
      (sum, item: any) => sum + item.quantity,
      0
    );

    res.json({
      success: true,
      data: {
        items,
        totalItems,
        totalPrice,
      },
    });
  }
);

export const addToCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bouquetId, quantity = 1 } = req.body;

    if (!bouquetId) {
      res.status(400).json({
        success: false,
        message: "ID букета обязателен",
      });
      return;
    }

    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    await CartService.addItem(bouquetId, quantity, userId, sessionId);

    const itemCount = await CartService.getCartItemCount(userId, sessionId);

    res.json({
      success: true,
      message: "Товар добавлен в корзину",
      data: {
        itemCount,
      },
    });
  }
);

export const updateCartItem = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bouquetId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Количество должно быть больше 0",
      });
      return;
    }

    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    await CartService.updateItemQuantity(bouquetId, quantity, userId, sessionId);

    res.json({
      success: true,
      message: "Количество обновлено",
    });
  }
);

export const removeFromCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bouquetId } = req.params;

    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    await CartService.removeItem(bouquetId, userId, sessionId);

    res.json({
      success: true,
      message: "Товар удален из корзины",
    });
  }
);

export const clearCart = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    await CartService.clearCart(userId, sessionId);

    res.json({
      success: true,
      message: "Корзина очищена",
    });
  }
);

export const getCartItemCount = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    const itemCount = await CartService.getCartItemCount(userId, sessionId);

    res.json({
      success: true,
      data: {
        itemCount,
      },
    });
  }
);

