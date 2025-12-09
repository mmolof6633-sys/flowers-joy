import { Response, Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { OrderService, CreateOrderData } from "../../services/orderService";
import { v4 as uuidv4 } from "uuid";

// Получить или создать sessionId из cookies
function getSessionId(req: Request, res: Response): string {
  let sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      sameSite: "lax",
    });
  }
  return sessionId;
}

export const createOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      customerInfo,
      recipientInfo,
      card,
      isAnonymous,
      askRecipientForDelivery,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      deliveryMethod,
      paymentMethod,
    } = req.body;

    // Валидация обязательных полей
    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.email) {
      res.status(400).json({
        success: false,
        message: "Заполните все обязательные поля покупателя",
      });
      return;
    }

    if (!deliveryMethod || !paymentMethod) {
      res.status(400).json({
        success: false,
        message: "Укажите способ доставки и оплаты",
      });
      return;
    }

    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : getSessionId(req, res);

    const orderData: CreateOrderData = {
      customerInfo,
      recipientInfo: recipientInfo || { isDifferentPerson: false },
      card: card || { enabled: false },
      isAnonymous: isAnonymous || false,
      askRecipientForDelivery: askRecipientForDelivery || false,
      deliveryAddress,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      deliveryTime,
      deliveryMethod,
      paymentMethod,
      userId,
      sessionId,
    };

    const order = await OrderService.createOrderFromCart(orderData);

    res.status(201).json({
      success: true,
      message: "Заказ создан",
      data: order,
    });
  }
);

export const getOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;

    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : req.cookies?.sessionId;

    const order = await OrderService.getOrderById(orderId, userId, sessionId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Заказ не найден",
      });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  }
);

export const getUserOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id?.toString();
    const sessionId = userId ? undefined : req.cookies?.sessionId;

    const orders = await OrderService.getUserOrders(userId, sessionId);

    res.json({
      success: true,
      data: orders,
    });
  }
);

