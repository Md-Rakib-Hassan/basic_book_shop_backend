/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Category {
  Fiction = 'Fiction',
  NonFiction = 'Non-Fiction',
  Science = 'Science',
  SelfHelp = 'Self-Help',
  Biography = 'Biography',
  History = 'History',
  Romance = 'Romance',
  Mystery = 'Mystery',
  Academic = 'Academic',
  Fantasy = 'Fantasy',
  Horror = 'Horror',
  ScienceFiction = 'Science Fiction',
  Thriller = 'Thriller',
  Childrens = "Children's",
  YoungAdult = 'Young Adult',
  Comics = 'Comics',
  GraphicNovel = 'Graphic Novel',
  Poetry = 'Poetry',
  ReligionSpirituality = 'Religion & Spirituality',
  Travel = 'Travel',
  HealthWellness = 'Health & Wellness',
  Cooking = 'Cooking',
  Others = 'Others',
}

export interface BookQueryParams {
  searchTerm?: string;
  category?: string;
  sort?: string;
}


export default interface IBook {
  Title: string;
  ISBN: string;
  Author: string;
  Category: Category;
  Price: number;
  ActualPrice: number;
  PickupPoint: Types.ObjectId;
  BookOwner: Types.ObjectId;
  RequireDeposit: boolean;
  PublishedYear: number;
  Description: string;
  ImageUrl: string;
  Condition: string;
  Availability: string;
  AdminApproved?: boolean;
  Rating?: number;
  Semester?: string;
  Subject?: string;
  Institution?: string;
  IsAvailable?: boolean;

}


