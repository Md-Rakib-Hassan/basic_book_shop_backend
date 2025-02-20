/* eslint-disable no-unused-vars */
import { ObjectId, Types } from "mongoose";

export enum Category {
  Fiction = 'Fiction',
  Science = 'Science',
  SelfDevelopment = 'SelfDevelopment',
  Poetry = 'Poetry',
  Religious = 'Religious',
}



export default interface IBook {
  Author: Types.ObjectId;
  Title: string;
  ISBN: string;
  Category: Category;
  Price: number;
  StockQuantity: number;
  PublishedYear: number;
  Description: string;
  ImageUrl: string;

}


export interface IBookReview{
  User: ObjectId;
  Rating: number;
  Details?: string;
}