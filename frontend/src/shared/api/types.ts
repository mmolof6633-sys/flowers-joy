// Тип для категории после populate
export interface IPopulatedCategory {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  image?: string;
}

export interface IBouquet {
  id: string;
  _id?: string; // Для совместимости с MongoDB
  name: string;
  slug?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  images: string[];
  imageUrl?: string; // Для обратной совместимости, будет первое изображение из массива
  categoryIds?: (string | IPopulatedCategory)[]; // Может быть массивом строк или объектов после populate
  categoryId?: string; // Для обратной совместимости
  tags?: string[];
  inStock?: boolean;
  sortOrder?: number;
  isRecommended?: boolean;
  recommendedOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApiResponse<T> {
  data: T;
  message?: string;
}

export interface IApiError {
  message: string;
  statusCode: number;
}

// Типы для корзины
export interface ICartItem {
  bouquetId: string;
  bouquet: IBouquet;
  quantity: number;
  totalPrice: number;
}

export interface ICart {
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ICartResponse {
  success: boolean;
  data: ICart;
  message?: string;
}

export interface ICartItemCountResponse {
  success: boolean;
  data: {
    itemCount: number;
  };
}

// Типы для заказов
export interface IOrderItem {
  bouquetId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder {
  _id: string;
  id?: string;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
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
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryMethod: "pickup" | "courier";
  paymentMethod: "card" | "cash";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "new" | "confirmed" | "preparing" | "delivering" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOrderData {
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
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryMethod: "pickup" | "courier";
  paymentMethod: "card" | "cash";
}

export interface IOrderResponse {
  success: boolean;
  message?: string;
  data: IOrder;
}
