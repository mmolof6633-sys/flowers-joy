import { Order, IOrder, IOrderItem } from "../models/Order";
import { Cart } from "../models/Cart";
import { Bouquet } from "../models/Bouquet";
import mongoose from "mongoose";

export interface CreateOrderData {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    comment?: string;
  };
  recipientInfo: {
    isDifferentPerson: boolean;
    name?: string;
    phone?: string;
  };
  card: {
    enabled: boolean;
    text?: string;
  };
  isAnonymous: boolean;
  askRecipientForDelivery: boolean;
  deliveryAddress?: {
    street: string;
    house: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
    comment?: string;
  };
  deliveryDate?: Date;
  deliveryTime?: string;
  deliveryMethod: "pickup" | "courier";
  paymentMethod: "card" | "cash";
  userId?: string;
  sessionId?: string;
}

export class OrderService {
  /**
   * Создать заказ из корзины
   */
  static async createOrderFromCart(
    data: CreateOrderData
  ): Promise<IOrder> {
    // Получаем корзину
    const query: any = {};
    if (data.userId) {
      query.userId = new mongoose.Types.ObjectId(data.userId);
    } else if (data.sessionId) {
      query.sessionId = data.sessionId;
    } else {
      throw new Error("Требуется userId или sessionId");
    }

    const cart = await Cart.findOne(query).populate({
      path: "items.bouquetId",
      model: "Bouquet",
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Корзина пуста");
    }

    // Формируем items для заказа
    const orderItems: IOrderItem[] = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const bouquet = cartItem.bouquetId as any;
      if (!bouquet) continue;

      if (!bouquet.inStock) {
        throw new Error(`Букет "${bouquet.name}" отсутствует в наличии`);
      }

      const itemPrice = bouquet.price;
      const itemTotal = itemPrice * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        bouquetId: bouquet._id,
        name: bouquet.name,
        price: itemPrice,
        quantity: cartItem.quantity,
        image: bouquet.images?.[0],
      });
    }

    // Валидация данных доставки
    if (data.deliveryMethod === "courier" && !data.askRecipientForDelivery) {
      if (!data.deliveryAddress?.street || !data.deliveryAddress?.house) {
        throw new Error("Укажите адрес доставки");
      }
      if (!data.deliveryDate) {
        throw new Error("Укажите дату доставки");
      }
      if (!data.deliveryTime) {
        throw new Error("Укажите время доставки");
      }
    }

    // Валидация данных получателя
    if (data.recipientInfo.isDifferentPerson) {
      if (!data.recipientInfo.name || !data.recipientInfo.phone) {
        throw new Error("Укажите имя и телефон получателя");
      }
    }

    // Создаем заказ
    const order = new Order({
      userId: data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined,
      sessionId: data.sessionId,
      items: orderItems,
      totalAmount,
      customerInfo: data.customerInfo,
      recipientInfo: data.recipientInfo,
      card: data.card,
      isAnonymous: data.isAnonymous,
      askRecipientForDelivery: data.askRecipientForDelivery,
      deliveryAddress: data.deliveryAddress,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
    });

    await order.save();

    // Очищаем корзину после создания заказа
    cart.items = [];
    await cart.save();

    return order;
  }

  /**
   * Получить заказ по ID
   */
  static async getOrderById(
    orderId: string,
    userId?: string,
    sessionId?: string
  ): Promise<IOrder | null> {
    const query: any = { _id: orderId };
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else if (sessionId) {
      query.sessionId = sessionId;
    }

    return await Order.findOne(query);
  }

  /**
   * Получить заказы пользователя
   */
  static async getUserOrders(
    userId?: string,
    sessionId?: string
  ): Promise<IOrder[]> {
    const query: any = {};
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return [];
    }

    return await Order.find(query).sort({ createdAt: -1 });
  }
}

