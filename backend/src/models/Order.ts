import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  bouquetId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryAddress: {
    street: string;
    house: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
    comment?: string;
  };
  recipientInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  deliveryDate: Date;
  deliveryTime: string;
  paymentMethod: "card" | "cash";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "new"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "delivered"
    | "cancelled";
  yandexKassaPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    bouquetId: {
      type: Schema.Types.ObjectId,
      ref: "Bouquet",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Заказ должен содержать хотя бы один товар",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      house: { type: String, required: true },
      apartment: String,
      entrance: String,
      floor: String,
      intercom: String,
      comment: String,
    },
    recipientInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "new",
        "confirmed",
        "preparing",
        "delivering",
        "delivered",
        "cancelled",
      ],
      default: "new",
    },
    yandexKassaPaymentId: String,
  },
  {
    timestamps: true,
  }
);

// Генерация номера заказа
OrderSchema.pre("save", async function (this: IOrder, next: () => void) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `FL${Date.now()}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Индексы
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
