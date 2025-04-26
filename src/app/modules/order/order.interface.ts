import { Types } from "mongoose";

export interface IBookDetails {
  BookId: Types.ObjectId;
  Quantity: number;
}
 
export interface ICustomerDetails {
  Name: string;
  Address: string;
  City: string;
  State: string;
  ZIPCode: string;
  Country: string;
  Phone: string;
}

export default interface IOrder {
  UserId: Types.ObjectId;
  BookDetails: IBookDetails[];
  OrderDate?: Date;
  CustomerDetails: ICustomerDetails;
  PaymentStatus?: string;
  tran_id: string;
  OrderStatus?: string;
  SubTotal: number;
  Total: number;
}
