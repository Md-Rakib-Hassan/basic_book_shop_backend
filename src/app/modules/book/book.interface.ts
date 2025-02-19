/* eslint-disable no-unused-vars */
import { ObjectId } from "mongoose";

export enum Category {
  Fiction = 'Fiction',
  Science = 'Science',
  SelfDevelopment = 'SelfDevelopment',
  Poetry = 'Poetry',
  Religious = 'Religious',
}

export interface IBookReview{
  user: ObjectId;
  rating: number;
  details?: string;
}

export default interface IBook {
  title: string;
  author: string;
  price: number;
  category: Category;
  description: string;
  reviews: IBookReview;
  quantity: number;
  inStock: boolean;
}
