import { model, Schema } from 'mongoose';
import IOrder from './order.interface';

const OrderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'], // Custom required message
      trim: true, // Trims extra spaces
    },
    product: {
      type: String,
      required: [true, 'Product is required'], // Custom required message
      trim: true, // Trims extra spaces
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity must be atleast 1'], // Custom required message
      trim: true, // Trims extra spaces
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price must be atleast 1'], // Custom required message
      trim: true, // Trims extra spaces
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', OrderSchema);
