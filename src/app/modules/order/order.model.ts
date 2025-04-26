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
    CustomerDetails: {
        Name: {
          type: String,
          required: [true, 'Name is required'],
        },
        Address: {
          type: String,
          required: [true, 'Address is required'],
        },
        City: {
          type: String,
          required: [true, 'City is required'],
        },
        State: {
          type: String,
          required: [true, 'State is required'],
        },
        ZIPCode: {
          type: String,
          required: [true, 'ZIP Code is required'],
        },
        Country: {
          type: String,
          required: [true, 'Country is required'],
        },
        Phone: {
          type: String,
          required: [true, 'Phone is required'],
        },
      
    },
    OrderDate: {
      type: Date,
      default: Date.now,
    },
    PaymentStatus: {
      type: String,
      default: 'Unpaid',
      enum: ['Unpaid', 'Paid','Failed'],
    },
    OrderStatus: {
      type: String,
      default: 'Pending',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled','Pending'],
    },
    tran_id: {
      type: String,
      required: [true, 'Transaction ID is required'],
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
