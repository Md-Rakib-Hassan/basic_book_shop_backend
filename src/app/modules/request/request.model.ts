import { Schema, model } from 'mongoose';
import { IRequest, PaymentStatus } from './request.interface';
import { boolean } from 'zod';

const requestSchema = new Schema<IRequest>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
        },
    BookOwner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: 'Pending',
    },
    securityDepositStatus: {
      type: String,
      enum: ['None','Hold', 'Refunded','Released To Owner'],
      default: 'None',
    },
    securityDepositAmount: {
      type: Number,
      default: 0,
    },
    bookFor: {
      type: String,
      enum:["Sell","Lend"]
    },
    bookPrice: {
      type: Number,
      default: 0,
    },
    isHandovered: {
      type: Boolean,
      default:false,
    },
    returnDate: {
      type:Date,
    },
    isReturned: {
      type: Boolean,
      default:false,
    },
    isReviewedBook: {
      type: Boolean,
      default:false,
    },
    requesterReviewed: {
      type: Boolean,
      default:false,
    },
    claimed: {
      type: Boolean,
      default:false,
    },
    ownerReviewed: {
      type: Boolean,
      default:false,
    },
    returnedAt: {
      type:Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected','Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const Request = model<IRequest>('Request', requestSchema);
