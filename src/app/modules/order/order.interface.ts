import { Types } from "mongoose";

export interface IBookDetails {
  BookId: Types.ObjectId;
  Quantity: number;
 }

export default interface IOrder {
  UserId: Types.ObjectId;
  BookDetails: IBookDetails[];
  OrderDate?: Date;
  PaymentStatus?: string;
  PaymentMethod: string;
  OrderStatus?: string;
  SubTotal: number;
  Total: number;
}
