import { model, Schema } from "mongoose";
import { PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    book: { type: Schema.Types.ObjectId, ref: "Book" },
    from:{type:Schema.Types.ObjectId,ref:"User"},
    transactionId: { type: String }, 
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);