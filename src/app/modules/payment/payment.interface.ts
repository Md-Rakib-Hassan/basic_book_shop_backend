import { Schema } from "mongoose";

export enum PaymentStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
  FAILED = 'Failed',
  HOLD = "Hold",
  REFUNDED = "Refunded",
  WITHDRAW="Withdraw"
}

export interface IPayment {
  user: Schema.Types.ObjectId;         
  amount: number;                      
  transactionId: string;
  status: PaymentStatus; 
  createdAt: Date;
  updatedAt: Date;
}