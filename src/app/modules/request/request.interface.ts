import { Types } from 'mongoose';

export enum PaymentStatus { 
  PENDING = 'Pending',
    ON_HOLD = 'On Hold',
    RELEASED_TO_OWNER = 'Released to Owner',
    REFUNDED = 'Deposit Refunded',
    FORFEITED = 'Forfeited',
  CANCELLED_REFUNDED = 'Cancelled Refunded',
  DEPOSIT = "Deposited",
    FAILED= "Failed"
}

export interface IRequest {
  _id?: string;
  book: Types.ObjectId;   // ID of the requested book
    requester: Types.ObjectId; // The user who requested
    BookOwner: Types.ObjectId; // The owner of the book
  note?: string;          // Optional note from requester
  status: 'Pending' | 'Accepted' | 'Rejected'|'Completed'; // Default: pending
  paymentStatus: PaymentStatus
  securityDepositStatus: 'None' | 'Hold' | 'Refunded','Released To Owner'; // Default: None
  bookFor: "Sell" | "Lend";
  securityDepositAmount?: number; // Amount of security deposit
  bookPrice?: number; // Price of the book
  isHandovered?: boolean;
  returnDate?: Date;
  claimed?: boolean;
  isReturned?: boolean;
  isReviewedBook?: boolean;
  requesterReviewed?: boolean;
  ownerReviewed?: boolean;
  returnedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
