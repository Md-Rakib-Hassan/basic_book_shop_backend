import { Types } from "mongoose";

export interface IReview {
  UserId: Types.ObjectId; // FK to User
  BookId: Types.ObjectId; // FK to Book
  ReviewData: {
    Rating: number; // 1..5
    ReviewText: string;
    ReviewDate: Date;
  };
}

export type TReviewRole = 'admin' | 'user';
