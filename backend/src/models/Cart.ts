import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  bouquetId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    bouquetId: {
      type: Schema.Types.ObjectId,
      ref: "Bouquet",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: {
      type: String,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Индексы
CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
