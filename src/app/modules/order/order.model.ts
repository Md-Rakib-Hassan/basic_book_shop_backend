import { model, Schema } from 'mongoose';
import IOrder, { IBookDetails } from './order.interface';

const BookDetailsSchema = new Schema<IBookDetails>(
  {
    BookId: {
      type: Schema.Types.ObjectId,
      required: [true, 'BookId is required'],
      ref: 'Book',
    },
    Quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      required: [true, 'UserId is required'],
      ref: 'User',
    },
    BookDetails: {
      type: [BookDetailsSchema],
      required: [true, 'BookDetails are required'],
    },
    OrderDate: {
      type: Date,
      default: Date.now,
    },
    PaymentStatus: {
      type: String,
      default: 'Unpaid',
      enum: ['Unpaid', 'Paid'],
    },
    PaymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Mobile Banking', 'Cash on Delivery'],
    },
    OrderStatus: {
      type: String,
      default: 'Processing',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    SubTotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: 0,
    },
    Total: {
      type: Number,
      required: [true, 'Total is required'],
      min: 0,
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', OrderSchema);
